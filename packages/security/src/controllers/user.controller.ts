import {repository} from '@loopback/repository';
import {post, param, get, requestBody} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {inject, Setter} from '@loopback/core';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
} from '@loopback/authentication';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import {JWTAuthenticationService, PasswordHasher, validateCredentials} from '../services';
import {JWTAuthenticationBindings, PasswordHasherBindings} from '../keys';
import * as _ from 'lodash';
import {Credentials} from '../repositories';
import {logger} from '../helpers';

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject.setter(AuthenticationBindings.CURRENT_USER)
    public setCurrentUser: Setter<UserProfile>,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHahser: PasswordHasher,
    @inject(JWTAuthenticationBindings.SERVICE)
    public jwtAuthenticationService: JWTAuthenticationService,
  ) {}

  @post('/users')
  async create(@requestBody() user: User): Promise<User> {
    logger.debug(`REST request for: ${JSON.stringify(user)}`);
    validateCredentials(_.pick(user, ['email', 'password']));
    user.password = await this.passwordHahser.hashPassword(user.password);

    // Save & Return Result
    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;
    return savedUser;
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(userId, {
      fields: {password: false},
    });
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject('authentication.currentUser') currentUser: UserProfile,
  ): Promise<UserProfile> {
    return currentUser;
  }

  // TODO(@jannyHou): missing logout function.
  // as a stateless authentication method, JWT doesn't actually
  // have a logout operation. See article for details:
  // https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    validateCredentials(credentials);
    const token = await this.jwtAuthenticationService.getAccessTokenForUser(
      credentials,
    );
    return {token};
  }
}

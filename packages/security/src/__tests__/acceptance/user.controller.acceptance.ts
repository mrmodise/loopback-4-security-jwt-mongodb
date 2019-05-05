import {Client, expect, toJSON} from '@loopback/testlab';
import {Response} from 'superagent';
import {Loopback4SecurityApplication} from '../..';
import {UserRepository} from '../../repositories';
import {MongoDataSource} from '../../datasources';
import {setupApplication} from './test-helper';
import * as _ from 'lodash';
import {JWTAuthenticationService} from '../../services';
import {PasswordHasherBindings, JWTAuthenticationBindings} from '../../keys';

describe('UserController', () => {
  let app: Loopback4SecurityApplication;
  let client: Client;
  const mongodbDS = new MongoDataSource();
  const userRepo = new UserRepository(mongodbDS);

  const user = {
    email: 'test@loopback.io',
    password: 'p4ssw0rd',
    firstname: 'Example',
    surname: 'User',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  beforeEach(clearDatabase);
  after(async () => {
    await app.stop();
  });

  it('creates new user when POST /users is invoked', async () => {
    const res = await client
      .post('/users')
      .send(user)
      .expect(200);

    // Assertions
    expect(res.body.email).to.equal('test@loopback.io');
    expect(res.body.firstname).to.equal('Example');
    expect(res.body.surname).to.equal('User');
    expect(res.body).to.have.property('id');
    expect(res.body).to.not.have.property('password');
  });

  it('throws error for POST /users with a missing email', async () => {
    const res = await client
      .post('/users')
      .send({
        password: 'p4ssw0rd',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    const errorText = JSON.parse(res.error.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal('email');
  });

  it('throws error for POST /users with an invalid email', async () => {
    const res = await client
      .post('/users')
      .send({
        email: 'test@loop&back.io',
        password: 'p4ssw0rd',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    expect(res.body.error.message).to.equal('invalid email');
  });

  it('throws error for POST /users with a missing password', async () => {
    const res = await client
      .post('/users')
      .send({
        email: 'test@loopback.io',
        firstname: 'Example',
        surname: 'User',
      })
      .expect(422);

    const errorText = JSON.parse(res.error.text);
    expect(errorText.error.details[0].info.missingProperty).to.equal(
      'password',
    );
  });

  it('throws error for POST /users with a string', async () => {
    await client
      .post('/users')
      .send('hello')
      .expect(415);
  });

  it('returns a user with given id when GET /users/{id} is invoked', async () => {
    const newUser = await userRepo.create(user);
    delete newUser.password;
    // MongoDB returns an id object we need to convert to string
    // since the REST API returns a string for the id property.
    newUser.id = newUser.id.toString();

    await client.get(`/users/${newUser.id}`).expect(200, newUser.toJSON());
  });


  describe('authentication functions', () => {
    let plainPassword: string;
    let jwtAuthService: JWTAuthenticationService;

    before('create new user', async () => {
      app.bind(PasswordHasherBindings.ROUNDS).to(4);

      const passwordHasher = await app.get(
        PasswordHasherBindings.PASSWORD_HASHER,
      );
      plainPassword = user.password;
      user.password = await passwordHasher.hashPassword(user.password);
      jwtAuthService = await app.get(JWTAuthenticationBindings.SERVICE);
    });

    it('login returns a valid token', async () => {
      const newUser = await userRepo.create(user);
      await client
        .post('/users/login')
        .send({email: newUser.email, password: plainPassword})
        .expect(200)
        .then(verifyToken);

      function verifyToken(res: Response) {
        const token = res.body.token;
        expect(token).to.not.be.empty();
      }
    });

    it('login returns an error when invalid credentials are used', async () => {
      // tslint:disable-next-line:no-unused
      const newUser = await userRepo.create(user);
      await client
        .post('/users/login')
        .send({email: user.email, password: 'wrongpassword'})
        .expect(401);
    });

    it('/me returns the current user', async () => {
      const newUser = await userRepo.create(user);
      const token = await jwtAuthService.getAccessTokenForUser({
        email: newUser.email,
        password: plainPassword,
      });

      newUser.id = newUser.id.toString();
      const me = _.pick(toJSON(newUser), ['id', 'email']);

      await client
        .get('/users/me')
        .set('Authorization', 'Bearer ' + token)
        .expect(200, me);
    });

    it('/me returns 401 when the token is not provided', async () => {
      const newUser = await userRepo.create(user);
      await jwtAuthService.getAccessTokenForUser({
        email: newUser.email,
        password: plainPassword,
      });

      await client.get('/users/me').expect(401);
    });
  });

  async function clearDatabase() {
    await userRepo.deleteAll();
  }
});

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import {MySequence} from './sequence';
import * as path from 'path';
import {
  AuthenticationBindings,
  AuthenticationComponent,
} from '@loopback/authentication';
import {JWTAuthenticationBindings, PasswordHasherBindings} from './keys';
import {StrategyResolverProvider} from './providers';
import {AuthenticateActionProvider} from './providers';
import {
  JWTAuthenticationService,
  JWT_SECRET,
  BcryptHasher
} from './services';
import {JWTStrategy} from './auth-strategies';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

export class Loopback4SecurityApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options?: ApplicationConfig) {
    super(options);

    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.bind(AuthenticationBindings.AUTH_ACTION).toProvider(
      AuthenticateActionProvider,
    );
    this.bind(AuthenticationBindings.STRATEGY).toProvider(
      StrategyResolverProvider,
    );

    // Bind JWT authentication strategy related elements
    this.bind(JWTAuthenticationBindings.STRATEGY).toClass(JWTStrategy);
    this.bind(JWTAuthenticationBindings.SECRET).to(JWT_SECRET);
    this.bind(JWTAuthenticationBindings.SERVICE).toClass(
      JWTAuthenticationService,
    );

    // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

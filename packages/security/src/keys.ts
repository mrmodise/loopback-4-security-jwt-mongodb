import {BindingKey} from '@loopback/context';
import {JWTStrategy} from './auth-strategies';
import {JWTAuthenticationService, PasswordHasher} from './services';

// Discussion point for reviewers:
// What would be the good naming conversion for bindings?
export namespace JWTAuthenticationBindings {
  export const STRATEGY = BindingKey.create<JWTStrategy>(
    'authentication.strategies.jwt.strategy',
  );
  export const SECRET = BindingKey.create<string>('authentication.jwt.secret');
  export const SERVICE = BindingKey.create<JWTAuthenticationService>(
    'services.authentication.jwt.service',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

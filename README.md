# Loopback 4 Security with JWT
A demo REST API application illustrating user registration and authentication with Loopback 4. This was extracted from
 [Loopback 4 Shopping example](https://github.com/strongloop/loopback4-example-shopping). In this application a User can 
 register via ``/users`` endpoint and login via ``/users/login``. Upon registration the user password is encrypted using Bcyrptjs.
  Once the User profile and credentials are saved to MongoDB, a user can login. A successful login request will result in 
  a JSON Web Token (JWT) being generated with an expiry time of 300 milliseconds.

## Prerequisites
Install the following:

* NodeJS vlatest (``https://nodejs.org/en/download/``)
* Loopback 4 (``npm install -g @loopback/cli``)
* MongoDB vlatest (``https://treehouse.github.io/installation-guides/``)

## Development
Install the dependencies:

```
cd loopback-4-security-jwt-mongodb
npm install 
```

Start the dev server:

```
npm start
```

To execute tests:
```
npm run test
```

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

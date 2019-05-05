# Loopback 4 Security with JWT
A demo REST API application illustrating user registration and authentication with Loopback 4. This was extracted from
 [Loopback 4 Shopping example](https://github.com/strongloop/loopback4-example-shopping). In this application a User can 
 register via ``/users`` endpoint and login via ``/users/login``. Upon registration the user password is encrypted using Bcyrptjs.
  Once the User profile and credentials are saved to MongoDB, a user can login. A successful login request will result in 
  a JSON Web Token (JWT) being generated with an expiry time of 300 milliseconds.

## Prerequisites
Install the following:

* NodeJS vlatest (https://nodejs.org/en/download/)
* Loopback 4 (https://v4.loopback.io/getting-started.html)
* MongoDB vlatest (https://treehouse.github.io/installation-guides/)

## Setup
Install the dependencies:

```
cd loopback-4-security-jwt-mongodb
$ npm install 
```

Start the dev server:

```
$ npm start
```

## Unit tests

To execute tests:
```
$ npm run test
```

## License

```
The MIT License (MIT)

Copyright (c) 2019 MP Mod

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

[![LoopBack](https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

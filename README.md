# Mapify JS SDK

The Mapify JS SDK library is a wrapper for the Mapify APIs, such as the Authorization API, allowing you to develop your Location Intelligence application and services using the javascript programming languages.

[![Build Status](https://builder.mapify.ai/buildStatus/icon?job=mapify-js-sdk)]()

## Mapify Platform

[Mapify](https://www.mapify.ai/) is a Location Intelligence Platform to prototype and develop large scalable enterprise solutions. It aggregates data from IOT sensing devices, modern and legacy information systems, enriching its value through location intelligence and machine learning layers to assist human decision on every imaginable use case while allowing virtually infinite platform extensibility.

* [Website](https://www.mapify.ai/)
* [Privacy Policy](https://www.mapify.ai/privacy/)
* [Terms of Use](https://www.mapify.ai/terms/)

## Requirements

* [NodeJS](https://nodejs.org/) >= 11.1.0
* A [Mapify](https://www.mapify.ai/) account

## Installing

Via [npm](https://www.npmjs.com/)
```bash
npm install @mapify/sdk
```

Via [yarn](https://yarnpkg.com/).
```bash
yarn add @mapify/sdk
```

## Basic usage examples

### Instantiate Authentication Client

```typescript
const { AuthenticationClient } = require(`@mapify/sdk`)
const authenticationClient = new AuthenticationClient({
    publicKey: "/path/to/key.pub"
})
```

### Sign with a API key

**Note:** Before you sign an Api Key, you must create one on [Mapify Console](https://console.mapify.ai/)

```js
const { AuthenticationClient, Token } = require(`@mapify/sdk`)
const authenticationClient = new AuthenticationClient()

async function sign(){
    try{
        const authorization = await authenticationClient.sign('apikey')

        // Authentication token
        authorization.authenticationToken
        // Refresh token
        authorization.refreshToken
        // Authentication token expire date (UTC in seconds)
        authorization.expires
        
        // Decoded payload
        tokenPayload = authenticationClient.decode(authorization.authenticationToken)
        tokenPayload.apis //the apis
        tokenPayload.payload //the custom payload

        // List of Claims
        const decodedToken = new Token(tokenPayload)
        claims = token.getClaimsByApi('api')
    }catch(e){
        // * `HTTPException` its thrown wherever is a problem with a Sign.
    }
}
```

### Sign with a API key and a custom payload

```js
const { AuthenticationClient } = require(`@mapify/sdk`)
const authenticationClient = new AuthenticationClient()

async function sign(){
    try{
        const customPayload = {
            example: "example"
        }
        const token = await authenticationClient.sign('apikey', customPayload)
    }catch(e){
        // * `HTTPException` its thrown wherever is a problem with a Sign.
    }
}
```

### Sign with a API key and a Handler

```js
const { Handler, AuthenticationClient } = require(`@mapify/sdk`)

class AuthenticationHandler implements Handler {
    construct(private readonly username, private readonly password) { }

    execute(payload) {
        return { 
            ...payload, 
            basic_auth: new Buffer(`${this.username}:${this.password}`).toString('base64') 
        };
    }
}

async function sign(){
    const authenticationClient = new AuthenticationClient()
    authenticationClient.withHandler(new AuthenticationHandler(`user`, `password`))

    try{
        const authorization = await authenticationClient.sign('apikey')
        // authorization code
    }catch(e){
        // * `HTTPException` its thrown wherever is a problem with a Sign.
    }
}
```

### Verify token

```js
const fs = require('fs')
const { Handler, AuthenticationClient } = require(`@mapify/sdk`)
const authenticationClient = new AuthenticationClient({
    publicKey: fs.readFileSync(`${__dirname}/key.pub`, { encoding: 'utf8' })
})

try{
    const isValid = authenticationClient.verify(`token`)
}catch(e){
    // * `TokenExpiredError` Token is expired
    // * `InvalidToken` Token is invalid with he public key
}

// Decode payload
tokenPayload = authenticationClient.decode(`token`)
tokenPayload.apis //the apis
tokenPayload.payload //the custom payload

// List of Claims
const decodedToken = new Token(tokenPayload)
claims = token.getClaimsByApi('api')
```

##### OR

```js
const fs = require('fs')
const { AuthenticationClient } = require(`@mapify/sdk`)

try{
    const isValid = AuthenticationClient.verify(`token`, fs.readFileSync(`${__dirname}/key.pub`, { encoding: 'utf8' }))
}catch(e){
    // * `TokenExpiredError` Token is expired
    // * `InvalidToken` Token is invalid with he public key
}
```

### Refresh Token

```js
const { AuthenticationClient } = require(`@mapify/sdk`)

async function refresh(refreshToken){
    try{
        const authenticationClient = new AuthenticationClient()
        const authorization = await authenticationClient.refresh(refreshToken)
    }catch(e){
        // * `HTTPException` its thrown wherever is a problem with a Sign.
    }
}
```

### Exceptions

This library throws exceptions to indicate problems:

* `HTTPException` its thrown wherever is a problem with a Sign.
* `TokenExpiredError` Token is expired
* `InvalidToken` Token is invalid with he public key

## Testing
### NPM
```bash
npm test
```
### Yarn
```bash
yarn install && yarn build && yarn test
```
### Docker

```sh
docker build . -t mapify-js-sdk && \
docker run -it mapify-php-sdk sh -c "yarn test"
```

## Contributing

Please follow our [contributor guide](/CONTRIBUTING.md)

## License

This project is licensed under the terms of the [Apache License Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0).

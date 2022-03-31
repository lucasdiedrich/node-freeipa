# node-freeipa

[![CodeQL](https://github.com/lucasdiedrich/node-freeipa/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/lucasdiedrich/node-freeipa/actions/workflows/codeql-analysis.yml)
[![Coverage Status](https://coveralls.io/repos/github/lucasdiedrich/node-freeipa/badge.svg)](https://coveralls.io/github/lucasdiedrich/node-freeipa)
[![npm](https://img.shields.io/npm/dm/node-freeipa)](https://img.shields.io/npm/dm/node-freeipa)
[![npm](https://img.shields.io/npm/v/node-freeipa)](https://www.npmjs.com/package/node-freeipa)
![npm](https://img.shields.io/npm/l/express.svg)

> A module to consume Freeipa server JSON_RPC API.


## Install

```
$ npm i --save node-freeipa
```

## Usage

First of all import the module and configure it, the user and password are needed to authenticate to the API.
```js
const ipa = require('node-freeipa')

const opts = {
	server: "ipaserver.yourdomain",
	auth: {
		user: 'someuser',
		pass: 'someuserpassword'
	}
};

ipa.configure(opts);
```

Than make the call to desired method, below calling the json_metadata to return all methods provided by freipa server.
```js
// Calling the method
ipa.json_metadata.then(result => {
  console.log(result);
});

// Using async/await
let result = await ipa.json_metadata();
console.log(result);
```

Just remember, all methods will return a promise. A list with all methods can be seen in https://server/ipa/ui/#/p/apibrowser/type=command

## DOCs

### configure (options)

#### options

Type: `json`

Pass all attributes for module configuration, the ones you can use:

```js
var options = {
	server: "domain-not-changed", //server.domain of your destination
	auth: {
		user: false,
		pass: false,
	},
	ca: false, //Your Freeipa's CA loaded with fs
	expires: 1440, // Time in minutes to expiration of cookie/auth.
	cacheFolder: '.tmp', // Location where the cookie cache will be saved. Default: inside node_modules of the app.
};
```

### ipa.method([args],{options})

#### method

Type: `String`

The method you wan't to call, ex: user_find.

#### [args]

Type: `Array`

Array of arguments you wan't to use, default: [].

#### {options}

Type: `Json object`

Json object containing options for the request, default: {}.

```js
ipa.user_find().then(result => { });
//same as
ipa.user_find([""],{}).then(result => { });
// searching by an user with login
ipa.user_find([""],{login: 'mylogin'}).then(result => { });
// searching by criteria only
ipa.user_find(['mylogin']).then(result => { });
// searching by criteria only and option
ipa.user_find(['mylogin'], {mail: 'mylogin@domain.com'}).then(result => { });
```

### Freeipa Error codes:

These are padronized erros returning by any of the requests. Every error are returned from resolve, reject was discarded on version 2.2+.

| ERROR  | DESC
|---|---|
|  FREEIPA.NOARGS | No options was passed to Request Builder  |
|  FREEIPA.NO_DATA | No data returned  |
|  FREEIPA.AUTH_ERROR | Invalid authentication or json parse  |
|  FREEIPA.REQUEST_ERROR | Error during the request  |
|  FREEIPA.UNHANDLED_ERROR | Unhandled error  |
|  <IPA.ERROR> | Returned from Freeipa Servers |

### Freeipa API usage:

Below are some helpers on how to use Freeipa API:

[Talking to Freeipa](https://vda.li/en/posts/2015/05/28/talking-to-freeipa-api-with-sessions/)
[Freeipa API_Examples](https://www.freeipa.org/page/API_Examples)

## License

MIT © [Lucas Diedrich](https://github.com/lucasdiedrich)

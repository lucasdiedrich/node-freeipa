# node-freeipa

[![Build Status](https://travis-ci.org/lucasdiedrich/node-freeipa.svg?branch=master)](https://travis-ci.org/lucasdiedrich/node-freeipa)
[![Coverage Status](https://coveralls.io/repos/github/lucasdiedrich/node-freeipa/badge.svg)](https://coveralls.io/github/lucasdiedrich/node-freeipa)
[![npm](https://img.shields.io/npm/dw/localeval.svg)](https://www.npmjs.com/package/node-freeipa)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/node-freeipa)
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
ipa.json_metadata.then((result, reject) => {
  console.log(result);
});
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

### Freeipa API usage:

Below are some helpers on how to use Freeipa API:

[Talking to Freeipa](https://vda.li/en/posts/2015/05/28/talking-to-freeipa-api-with-sessions/)
[Freeipa API_Examples](https://www.freeipa.org/page/API_Examples)

## License

MIT © [Lucas Diedrich](https://github.com/lucasdiedrich)

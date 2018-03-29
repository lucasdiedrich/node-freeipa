# node-freeipa

[![Build Status](https://travis-ci.org/lucasdiedrich/node-freeipa.svg?branch=master)](https://travis-ci.org/lucasdiedrich/node-freeipa)
[![Coverage Status](https://coveralls.io/repos/github/lucasdiedrich/node-freeipa/badge.svg)](https://coveralls.io/github/lucasdiedrich/node-freeipa)
[![npm](https://img.shields.io/npm/dw/localeval.svg)](https://www.npmjs.com/package/node-freeipa)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/node-freeipa)
![npm](https://img.shields.io/npm/l/express.svg)

> A module to consume Freeipa Server API using promises.


## Install

```
$ npm install --save node-freeipa
```

## Usage

```js
var ipa = require('node-freeipa')
var fs = require('fs');

var opts = {
	server: "ipaserver.yourdomain",
	ca: fs.readFileSync('ca.crt'), //path of your freeipa ca.crt
	auth: {
		user: 'someuser',
		pass: 'someuserpassword',
	},
};

// Initializing ipa module
ipa.configure(opts);

// Using call method
ipa.call('json_metadata').then(function(result) {
 	console.log(result);
 	// Giant list with all methods capable of being requested.
});

// Using auto-generated client
setTimeout( function() {
	ipa.c.user_find([""],{"uid":'someuser'}).then(function(result){
		console.log(result);
		// [ { dn: 'uid=someuser,cn=users,cn=accounts,dc=unila',
		//    gidnumber: [ '0003' ],
		//    givenname: [ 'Some' ],
		//    has_keytab: true,
		//    has_password: true,
		//    homedirectory: [ '/home/someuser' ],
		//    loginshell: [ '/bin/bash' ],
		//    mail: [ 'someuser@domain' ],
		//    nsaccountlock: false,
		//    sn: [ 'User' ],
		//    uid: [ 'someuser' ],
		//	});
}, 5000);

```


## API

### configure(options)

#### options

Type: `json object`

Pass all attributes for module configuration, the ones you can use:
```js
var options = {
	auth_method: AUTH_PASS, //Authentication method, by default is HTTP
	server: "domain-not-changed", //server.domain of your destination
	auth: {
		user: false,
		pass: false,
	},
	ca: false, //Your Freeipa's CA
	krb: false, //Not used yet
	rejectUnauthorized: true, //If you don't use CA this is auto-defined as false.
	configure_client: true, //Define if should auto-build the client using json api.
	client_version: "2.156", // Default client version to supress freeipa warning message.
	expires: 86400, // Time in minutes to expiration of cookie/auth.
};
```

### call(method_url,[args],{options})

#### method_url

Type: `String`

The method you wan't to call, ex: user_find.

#### args

Type: `Array`

Array of arguments you wan't to use, if not provided [""] will be used.

#### options

Type: `Json object`

The options you want to user on the request, if not provided {} will be used.

```js
ipa.call('user_find').then(function(result) {});
//same as
ipa.call('user_find',[""],{}).then(function(result) {});
```

# Using 'c' method
The 'c' method is created after the client configure the freeipa module by the first time, it call your server and get a list of all possible method you can call.

Because some times freeipa take a lit bit to return the methods, it should be wait at least 7 seconds before using the class.
### Usage: c.some_method([args],{options})

#### args

Type: `Array`

Array of arguments you wan't to use, if not provided [""] will be used.

#### options

Type: `Json object`

The options you want to user on the request, if not provided {} will be used.

```js
ipa.c.user_find().then(function(result) {});
//same as
ipa.c.user_find([args],{options}).then(function(result) {});
//same as
ipa.call('user_find',[args]],{options}).then(function(result) {});
```

## License

MIT © [Lucas Diedrich](https://github.com/lucasdiedrich)

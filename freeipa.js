'use strict';

var Promise = require('promise');
var https 	= require('https');
var extend 	= require('util')._extend;
var querystring = require('querystring');

const	METHOD	  = 'post',
		AUTH_PASS = 'auth',
		AUTH_KRB  = 'kerberos',
		URL_SESSION = '/ipa/session',
		URL_LOGIN 	= '/login_password',
		URL_JSON 	= '/json';

/*
	This are the default configurable options, and should be changed using the freeipa.configure({opts})
*/
var options = { 
	auth_method: AUTH_PASS,
	server: "thisshouldbefilledwithfreeipadomain",
	auth: {
		user: false,
		pass: false,
	},
	ca: false,
	krb: false,
	rejectUnauthorized: true,
};

var auth_credentials = {
	token: false,
	isValid: function() 
	{
		if ( !token )
			return false;

		var expires = new Date(this.token.split(';')[3].split('=')[1]);
		var current = new Date();

		return expires > current;
	},
};

/*
	Check if we've one valid token, if not, request new one.
*/
function check_session()
{
	if ( auth_credentials && auth_credentials.is_valid ) {
		return true;
	} else {
		var login_args = {user: options.auth.user, password: options.auth.pass};
		
		call(URL_LOGIN, login_args, (response, body) => { 
			auth_credentials.token = response.headers['set-cookie'] 
		});
	}

	return false;
};

/*
	Build one new request options based on its path.
*/
function request_opts(path, args) 
{
	if (!args) {
		console.log("Freeipa: Blank args not possible for this type of request");
		return;
	}

	// This is because of the weird freeipa access api. 
	if (path == URL_LOGIN) {
		var data = querystring.stringify(args);
	} else {
		var data = JSON.stringify(args);
	}

	var req_opts = {
		method: METHOD,  
		host: options.server,
		path: URL_SESSION + path,
		ca: options.ca,
		headers: { 
			'accept': 'text/plain',
			'content-type': 'application/x-www-form-urlencoded',
			'referer': "https://" + options.server + "/ipa",
			'Content-Length': data.length
		},
		rejectUnauthorized: options.rejectUnauthorized
	}

	if ( path != URL_LOGIN ) {
		req_opts.headers = extend(req_opts.headers, {
			'Cookie': auth_credentials.token[0],
			'accept': 'application/json',
      		'content-type': 'application/json',			
		});
	}

	return {req_opts, data};
};

/*
	This make HTTP/HTTPS request and return a promise without using 3rd party libs.
	This is for internal use only, should not be used by other modules.
*/
function call(path, params, callback)
{
	var opts = request_opts(path, params);

	var req = https.request(opts.req_opts, (res) => {
		var body = "";
		res.on('data', (chunk) => { body += chunk; });
		res.on('end', () => {
			if (callback) {
				callback(res,body); 
			}
		});
	});

	req.on('error', (e) => { console.log(`Freeipa: problem with request: ${e.message}`) });

	if (opts.data) {
		req.write(opts.data);
	} 

	req.end();

	return req;
};

/*
	Just an wrapper for call function without the path param. 
	All call functions should be made to /json location.
*/
function call_ext(params, callback)
{
	return call(URL_JSON, params, callback);
}

/*
	Configure the initial usage of the plugin and than calls
	check_session() to get the first enabled token.
*/
function configure(_options)
{
	options = extend(options, _options);

	if ( !options.ca ) {
		options.rejectUnauthorized = false;
	}

	if ( options.krb ) {
		options.auth_method = AUTH_KRB;
	}

	check_session();
};

module.exports.configure = configure;
module.exports.call = call_ext;


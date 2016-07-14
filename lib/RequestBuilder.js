'use strict';

var https 	= require('https'),
 	Promise = require('promise'),
	qs 		= require('querystring'),
	extend 	= require('util')._extend;

var Session = require('./Session');
var	Config 	= require('./Config');

const	URL_SESSION = '/ipa/session',
		URL_LOGIN 	= '/login_password',
		URL_JSON 	= '/json';

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
		var data = qs.stringify(args);
	} else {
		var data = JSON.stringify(args);
	}

	var req_opts = {
		method: 'POST',  
		host: Config.server,
		path: URL_SESSION + path,
		ca: Config.ca,
		headers: { 
			'accept': 'text/plain',
			'content-type': 'application/x-www-form-urlencoded',
			'referer': "https://" + Config.server + "/ipa",
			'Content-Length': data.length
		},
		rejectUnauthorized: Config.rejectUnauthorized
	}

	if ( path != URL_LOGIN ) 
	{
		console.log(Session.token)
		req_opts.headers = extend(req_opts.headers, {
			'Cookie': Session.token,
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
function call(method, params)
{
	return new Promise((resolve, reject) => {
		var opts = request_opts(method, params);

		var req = https.request(opts.req_opts, (res) => {
			var body = "";
			res.on('data', (chunk) => { body += chunk; });
			res.on('end', () => {
				if (method == "/login_password") 
				{
					resolve(res.headers['set-cookie'][0]);
				} else {
					resolve(body);
				}
			});
		});

		req.on('error', (e) => { 
			console.log(`Freeipa: problem with request: ${e.message}`);
			reject(e)
		});

		if (opts.data) {
			req.write(opts.data);
		} 

		req.end();
    });
};

/*
	Gets a new session token to make some new requests.
*/
function get_session()
{
	var login_args = {user: Config.auth.user, password: Config.auth.pass};
	
	return call(URL_LOGIN, login_args);
	// return call();
}

/*
	This class handle the requests based on method,args,options. Also returns all request using promises.
*/
function build(method,args,options)
{
	Config = global.Config;

	if ( !Session.isValid || !Session.isValid() ) 
	{
		return get_session().then(function(result) {
			Session = new Session(result);
			return call(URL_JSON, {method: method, params: [args,options]});
		});
	} else
		return call(URL_JSON, {method: method, params: [args,options]});
	// var request_promise  = call(method,args,options);
	// return request_promise;
}

module.exports.build = build;

// var login_args = {user: Config.auth.user, password: Config.auth.pass};

// call(URL_LOGIN, login_args, (response, body) => { 
// 	auth_credentials.token = response.headers['set-cookie'] 
// });

// module.exports = Main;
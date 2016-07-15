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
		// Add server version on request
		args.params[1] = extend(args.params[1], {
			'version': Config.client_version,			
		});

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
				if (method == URL_LOGIN) 
				{
					resolve(res.headers['set-cookie'][0]);
				} else {
					var parsed_return = JSON.parse(body).result;
					
					if( parsed_return.result )
					{
						resolve(parsed_return.result);
					} else {
						resolve(parsed_return);
					}
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
}

/*
	Gets a promise using json request.
*/
function get_request(method,args,options)
{
	var default_args = {method: method, params: [args,options]};

	return call(URL_JSON, default_args)
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
			return get_request(method,args,options);
		});
	} else {
		return get_request(method,args,options);
	}
}

module.exports.build = build;
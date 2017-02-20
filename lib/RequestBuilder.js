'use strict';

var https 	= require('https'),
 	Promise = require('promise'),
	qs 		= require('querystring'),
	extend 	= require('util')._extend;

const Session = require('./Session');

var	Config 	= require('./Config');
var session = new Session();

const	URL_SESSION = '/ipa/session',
		URL_LOGIN 	= '/login_password',
		URL_JSON 	= '/json';

/*
	Build one new request options based on its path.
*/
function request_opts(path, args) 
{
	if (!args) 
	{
		throw new Error("Freeipa: Blank args not possible for this type of request.")

		return;
	}

	// This is because of the weird freeipa access api. 
	if (path == URL_LOGIN) 
	{
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
			'Cookie': session.token,
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
					if(res.headers['set-cookie'])
					{
						resolve(res.headers['set-cookie'][0]);
					}
					else
					{
						throw new Error("It wasn't possible to get the auth cookie, check your configs.")
					}
				} else {
					var body_parse = JSON.parse(body);					
					console.debug("body parsed: %s", JSON.stringify(body_parse));

					if( (!body_parse.error) && 
						body_parse.result && 
						body_parse.result.result && 
						(!Array.isArray(body_parse.result.result) || 
													(Array.isArray(body_parse.result.result) && body_parse.result.count > 0)))
					{
						resolve(body_parse.result.result);
					} else {
						console.debug(`Freeipa request returned data: ${body_parse}`)
						resolve({error: true});
					}
				}
			});
		});

		req.on('error', (e) => { 
			console.error(`Freeipa: problem with request: ${e.message}`);
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
	
	if (session.isValid())
	{
		return get_request(method,args,options);
	}
	else
	{
		return get_session().then(function(result) {
			session = new Session(result);
			return get_request(method,args,options);
		});
	}
}

module.exports.build = build;
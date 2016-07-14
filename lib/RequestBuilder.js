'use strict';

var https 	= require('https'),
 	Promise = require('promise'),
	qs 	= require('querystring');

const	URL_SESSION = '/ipa/session',
		URL_LOGIN 	= '/login_password',
		URL_JSON 	= '/json';

/*
	This class handle the requests based on method,args,options. Also returns all request using promises.
*/
function Main()
{
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

		if ( path != URL_LOGIN ) 
		{
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
	function call(method, params, callback)
	{
		var opts = request_opts(method, params);

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
}

module.exports = Main();
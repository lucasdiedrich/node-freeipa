'use strict';

var	Config 	= require('./lib/Config'),
	Client  = require('./lib/Client');

const METADATA = 'json_metadata';
var client = null;
var self = this;

/*
	Just an wrapper for call function without the path param. 
*/
function call(method, args, options)
{
	var Req = require('./lib/RequestBuilder');

	return Req.build(method, args || [""], options || {});
}

/*
	Init config class, rebuild client class with new methods;
*/
function configure(_options)
{
	Config.init(_options);

	if(global.Config.configure_client)
	{
		new Client(call).then(function(client)
		{
			module.exports.c = client;
		});
	}
}

module.exports.configure = configure;
module.exports.call = call;
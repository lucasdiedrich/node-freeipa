'use strict';

var	Config 	= require('./lib/Config'),
	Req 	= require('./lib/RequestBuilder');

/*
	Just an wrapper for call function without the path param. 
*/
function call(method, args, options)
{
	return Req.build(method, args || [""], options || {});
}

/*
	Init config class, create first session, rebuild class with new methods;
*/
function configure(_options)
{
	Config.init(_options);
}

module.exports.configure = configure;
module.exports.call 	 = call;
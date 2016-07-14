'use strict';

var extend 	= require('util')._extend;

const	METHOD	  = 'post',
		AUTH_PASS = 'auth',
		AUTH_KRB  = 'kerberos';

/*
	Default options
*/
var options = {
	auth_method: AUTH_PASS,
	server: "domain-not-changed",
	auth: {
		user: false,
		pass: false,
	},
	ca: false,
	krb: false,
	rejectUnauthorized: true,
};

/*
	This class handle the general config of the app. 
	This are the default configurable options, and should be changed using the freeipa.configure({opts})
*/
var Main = function( _options )
{
	options = extend(options, _options);

	if ( !options.ca ) 
	{
		options.rejectUnauthorized = false;
	}

	if ( options.krb ) 
	{
		options.auth_method = AUTH_KRB;
	}

	return options;
}

module.exports = Main;
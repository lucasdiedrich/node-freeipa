'use strict';

/*
	This class handle the credentials of the freeipa request, also verifies if the app has an 
	active token. If the token is not valid or will be expiring soon it should request a new one
	as return everything as a promise.
*/
var Main = function(_token)
{
	var self = this;

	self.token = _token;
	self.isValid = function() 
	{
		if ( !self.token )
		{
			return false;
		}

		var expires = new Date(self.token.split(';')[3].split('=')[1]);
		var current = new Date();

		return expires > current;
	};

	return self;
}

module.exports = Main;

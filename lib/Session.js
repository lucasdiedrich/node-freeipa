'use strict';

const fs 		 = require("fs");
const CACHE_PATH = "cache/cookie.json";

/*
	This class handle the credentials of the freeipa request, also verifies if the app has an 
	active token. If the token is not valid or will be expiring soon it should request a new one
	as return everything as a promise.
*/
var Main = function(_token)
{
	var self = this;

	if(_token)
	{
		self.token = _token;
		fs.writeFile(CACHE_PATH, JSON.stringify({'token': _token}), "utf8", function(err){ console.log(err)} );
	} else {
		try {
			var cached_token = require("../" + CACHE_PATH);

			if( cached_token.token )
			{
				self.token = cached_token.token;
			}
		} 
		catch (err)
		{
			self.token = "";
		}
	}

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

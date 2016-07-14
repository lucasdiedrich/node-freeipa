'use strict';

var auth_credentials = {
	token: false,
	isValid: function() 
	{
		if ( !token )
			return false;

		var expires = new Date(this.token.split(';')[3].split('=')[1]);
		var current = new Date();

		return expires > current;
	}
};

/*
	Check if we've one valid token, if not, request new one.
*/
function check_session()
{
	if ( auth_credentials && auth_credentials.is_valid ) 
	{
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
	This class handle the credentials of the freeipa request, also verifies if the app has an 
	active token. If the token is not valid or will be expiring soon it should request a new one
	as return everything as a promise.
*/
var Main = function()
{

}

module.exports = Main();
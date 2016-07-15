'use strict';

const METADATA = 'json_metadata';

/*
	This class handles the dynamic creation of methods based on freeipa server version.
	All methods are returned using a json_medata request.
*/
var Main = function(callback)
{
	var self = this;

	// self.client = {};
	return new Promise((resolve, reject) => {
		callback(METADATA).then(function(result) 
		{
			for (const attributename in result.methods) 
			{			
				self[attributename] = function(args , options)
				{
					return callback(attributename, args, options);
				};
			}
			resolve(self);
		});	
	});
}

module.exports = Main;

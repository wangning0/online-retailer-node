var crypto = require('crypto');

module.exports = function (str){
	var sha1 = crypto.createHash('sha1');
		return sha1.update(str).digest('hex');
}
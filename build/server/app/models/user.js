/*
	Depends on: Model

*/

var User = exports.User = function(options, mongoose) {
	var self = this;
	var Schema = mongoose.Schema;

	var userSchema = new Schema({
		displayName: String,
		password: String,
		battleTag: String
	});

	var UserModel = mongoose.model('Users', userSchema);

	return UserModel;
};
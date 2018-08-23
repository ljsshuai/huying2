var mongoose = require('mongoose')
	const user = new mongoose.Schema({token:String,name:String,password:String,subimage:String,phone:Number,email:String},{collection:'user'});
module.exports= mongoose.model('user', user,);
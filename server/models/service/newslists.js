var mongoose = require('mongoose')
	const dataSchema = new mongoose.Schema({NewsDetails:String,consult:Number},{collection:'newslists'});

var ServiceIndex=async (userId)=>{


}
module.exports= mongoose.model('newslists', dataSchema);
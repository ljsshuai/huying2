var mongoose = require('mongoose');
var WebsiteInformation = new mongoose.Schema({title:String,shortDescription:String,keyword:String},{ timestamps: true });
module.exports=mongoose.model('WebsiteInformation', WebsiteInformation);
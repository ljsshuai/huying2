var mongoose = require('mongoose');
var AboutUs = new mongoose.Schema({name:String,shortDescription:String,pay:String,author:String,date:String,ordering:Number,publish:Number},{ timestamps: true });
module.exports=mongoose.model('AboutUs', AboutUs);
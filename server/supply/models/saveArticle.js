var mongoose = require('mongoose');
var saveArticle = new mongoose.Schema({ title:String,readNum: Number,description:String,content:String,classifyId:String,subImages:String},{ timestamps: true });
module.exports=mongoose.model('saveArticle', saveArticle);
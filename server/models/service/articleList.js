var mongoose = require('mongoose');
var articleList = new mongoose.Schema({createdAt:Date,updatedAt:Date,title:String,shortDescription:String,url:String,author:String,image:String,date:String,ordering:Number,keyword:String,publish:Number},{ timestamps: true });
module.exports=mongoose.model('articleList', articleList);
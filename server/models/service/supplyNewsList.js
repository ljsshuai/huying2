var mongoose = require('mongoose')
const savearticles = new mongoose.Schema({ title:String,readNum: Number,description:String,content:String,classifyId:String,subImages:String},{collection:'savearticles'});
module.exports= mongoose.model('savearticles', savearticles,);
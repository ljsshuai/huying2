var mongoose = require('mongoose');
var saveSectionList = new mongoose.Schema({ name:String,sectionList: Array,affiliation:String},{ timestamps: true });
module.exports=mongoose.model('sectionList', saveSectionList);
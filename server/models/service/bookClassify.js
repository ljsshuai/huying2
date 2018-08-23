var mongoose = require('mongoose');
var bookClassify = new mongoose.Schema({ name: String},{ timestamps: true });
module.exports=mongoose.model('bookClassify', bookClassify);
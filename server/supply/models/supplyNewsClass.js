var mongoose = require('mongoose');
var supplyNewsClass = new mongoose.Schema({ name: String},{ timestamps: true });
module.exports=mongoose.model('supplyNewsClass', supplyNewsClass);
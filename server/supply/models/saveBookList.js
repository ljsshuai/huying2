var mongoose = require('mongoose');
var saveBookList = new mongoose.Schema({picture:String,name:String,state: String,time:String,keyword:Array,author:String,collect:Number,extent:Number,lastTime:String,hits:Number,recommend:Number,Category:String,intro:String},{ timestamps: true });
module.exports=mongoose.model('bookList', saveBookList);


// name:$('#content').find('dd').first().text().substr(0,$('#content').find('dd').first().text().length-5), //小说名称
//     state:$('#content tbody').find('tr').first().find('td').last().text().substr(1) , //状态
//     author:$('#content tbody').find('tr').first().find('td').first().next().next().text().substr(1),
//     //作者
//     collect:$('#content tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text().substr(1), //收藏数
//     extent:$('#content tbody').find('tr:nth-child(2)').find('td:nth-child(4)').text().substr(1), //文章长度
//     lastTime:$('#content tbody').find('tr:nth-child(2)').find('td:nth-child(6)').text().substr(1),//最后更新时间
//     hits:$('#content tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text().substr(1),  //点击数
//     recommend:$('#content tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text().substr(1), //推荐数
//     Category: $('#content tbody').find('tr').first().find('td').first().text().substr(1), //文章类别
//     intro:$('#content table').next().text().substr(4), //简介
//     keyword:[] //关键字
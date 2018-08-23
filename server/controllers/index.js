var articleList = require('../models/service/articleList')
var AboutUsList = require('../models/service/AboutUs');
var WebsiteInformationModel = require('../models/service/WebsiteInformation');
var user = require('../models/service/user');
const config=require('../../public/config');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var axios=require('axios')
var http = require('https');
var bookClassifyArray = [];
var moment = require('moment');
import md5 from "../models/util/md5"
import React, {Component} from 'react';
import serverRender from '../models/util/server-render';
import devstatic from '../models/util/dev-static';
var jwt = require('jsonwebtoken');
var apiData = require('../apiControllers/index');
const path = require('path')
const fs = require('fs');
var fn_index = async (ctx, next) => {
    await ctx.render('index',{
        title:'虎影科技官网'
    })
};

var about_us = async (ctx, next) => {
    var data=await apiData.AboutUsInFn(ctx);
    await ctx.render('about_us',{
        title:"虎影科技官网-关于我们",
        data:data.data.listdata
    })
};

var tiger_list = async (ctx, next) => {
    await ctx.render('tiger_list',{
        title:"虎影科技官网-智库"
    })
};


var tiger_talk = async (ctx, next) => {
    var data=await apiData.articleInFn(ctx);
    if(data.data.listdata!=undefined){
        data.data.listdata.forEach((val,i)=>{
            if(data.data.listdata[i].createdAt!=undefined){
                data.data.listdata[i].newCreatedAt=moment(data.data.listdata[i].createdAt).format('YYYY-MM-DD');
            }
        })
    }
    await ctx.render('tiger_talk',{
        title:"虎影科技官网-虎说",
        data:data.data
    })
}
var tiger_introduction = async (ctx, next) => {
    await ctx.render('tiger_introduction',{
        title:"虎影科技官网-产品"
    })
}
// var fn_signin = async (ctx, next) => {
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// }
// var getMenu = async (ctx, next) => {
//     ctx.body = {'data': await getNewsList(ctx)}
// }
//
// async function getNewsList(ctx) {
//     return new Promise((resolve, reject) => {
//         var tabBarJson = {news0: '要闻', news1: '文化', news2: '国内', news3: '国际', news4: '军事', news5: '财经', news6: '娱乐'}
//         newslists.find({classify: tabBarJson[ctx.request.body.fields.newsClassify]}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.fields.pageNum * 20).exec(function (err, data) {
//             resolve(data)
//         })
//     })
// }
//
//
// var userReg = async (ctx, next) => {
//     ctx.body = await userRegPro(ctx)
// }
//
// async function userRegPro(ctx) {
//     return new Promise((resolve, reject) => {
//         if (ctx.request.body.fields.name == '') {
//             resolve('用户不能为空')
//         }
//         user.find({name: ctx.request.body.fields.name}, function (err, data) {
//             if (data.length == 0) {
//                 user.create({
//                     name: ctx.request.body.fields.name,
//                     password: md5('message' + ctx.request.body.fields.password),
//                     email: ctx.request.body.fields.email
//                 }, function (err, data) {
//                     if (!err) {
//                         console.log(data)
//                         resolve({status: 'ok', msg: '注册成功', data: data})
//                     }
//                 })
//             } else {
//                 resolve({status: 'err', msg: '该用户名已经存在'})
//             }
//         })
//     })
// }
//
// var userLogin = async (ctx, next) => {
//     await userLoginPro(ctx).then(data=>{
//         if(data.status=='ok'){
//
//         }
//          ctx.body=data;
//     })
// };
//
// async function userLoginPro(ctx) {
//     console.log(typeof ctx.request.body, ctx.request.body.name)
//     return new Promise((resolve, reject) => {
//         if (ctx.request.body.name == '') {
//             resolve('用户不能为空')
//         }
//         if (ctx.request.body.password == '') {
//             resolve('密码不能为空')
//         }
//         user.find({
//             name: ctx.request.body.name,
//             password: md5(ctx.request.body.password)
//         }, function (err, data) {
//             if (data.length == 0) {
//                 resolve({status: 'err', msg: '用户不存在或者密码错误', 'data': data[0]})
//             } else {
//                 var token = jwt.sign({name: data[0].name}, config.secret,{
//                     expiresIn: "1h"  // token到期时间设置
//                 });
//                 data[0].token = token;
//                 data[0].save();
//
//                 resolve({status: 'ok', msg: '登录成功', data: data[0]})
//             }
//         })
//     })
// }
//
//
// var article = async (ctx, next) => {
//     ctx.body = await articleFn(ctx)
// }
//
// async function articleFn(ctx) {
//     return new Promise((resolve, reject) => {
//         switch (ctx.request.body.type) {
//             case "add":
//                 delete ctx.request.body.type;
//                 articleList.create(Object.assign(ctx.request.body,{ordering:ctx.request.body.ordering === 'undefined' ? 0 : ctx.request.body.ordering }), function (err, data) {
//                     if (err){
//                         console.log(err)
//                         resolve({status: 'err', msg: '添加失败'});
//                     }
//                     console.log(data, 'add')
//                     resolve({status: 'ok', msg: '添加成功'})
//                 })
//                 break;
//             case "edit":
//                 console.log(11)
//                 delete ctx.request.body.type;
//                 ctx.request.body.ordering === undefined ? ctx.request.body.ordering = 0 : null;
//                 articleList.find({_id: ctx.request.body._id}, function (err, data) {
//                     delete ctx.request.body._id;
//                     for(var i in ctx.request.body){
//                         data[0][i]=ctx.request.body[i]
//                     }
//                     data[0].save();
//                     resolve({status: 'ok', msg: '修改成功'})
//                 });
//                 break;
//             case "query":
//                 delete ctx.request.body.type
//                 articleList.count().exec(function (err, data) {
//                     articleList.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                         console.log(data, listdata)
//                         resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                         // resolve({'listSum': data, 'listdata': listdata})
//                     })
//                 })
//                 break;
//             case "search":
//                 articleList.count({'title': {'$regex': ctx.request.body.search}}).exec(function (err, data) {
//                     articleList.find({'title': {'$regex': ctx.request.body.search}}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                         console.log(data, listdata, 'search')
//                         resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                         // resolve({'listSum': data, 'listdata': listdata})
//                     })
//                 })
//                 break;
//             case "delete":
//                 articleList.remove({_id: ctx.request.body._id}).exec(function (err, data) {
//                     console.log(data, 'delete')
//                     resolve({status: 'ok', msg: '成功删除'})
//                 })
//                 break;
//             default:
//                 break;
//             // 与 case 1 和 case 2 不同时执行的代码
//         }
//     })
// }
//
//
//
// var aboutus = async (ctx, next) => {
//     ctx.body = await AboutUsFn(ctx)
// }
//
// async function AboutUsFn(ctx) {
//     return new Promise((resolve, reject) => {
//         switch (ctx.request.body.type) {
//             case "add":
//                 delete ctx.request.body.type;
//                 AboutUsList.create(Object.assign(ctx.request.body,{ordering:ctx.request.body.ordering === 'undefined' ? 0 : ctx.request.body.ordering }), function (err, data) {
//                     if (err){
//                         console.log(err)
//                         resolve({status: 'err', msg: '添加失败'});
//                     }
//                     console.log(data, 'add')
//                     resolve({status: 'ok', msg: '添加成功'})
//                 });
//                 break;
//             case "edit":
//                 delete ctx.request.body.type;
//                 ctx.request.body.ordering === undefined ? ctx.request.body.ordering = 0 : null;
//                 AboutUsList.find({_id: ctx.request.body._id}, function (err, data) {
//                     delete ctx.request.body._id;
//                     for(var i in ctx.request.body){
//                         data[0][i]=ctx.request.body[i]
//                     }
//                     data[0].save();
//                     resolve({status: 'ok', msg: '修改成功'})
//                 });
//                 break;
//             case "query":
//                 delete ctx.request.body.type
//                 AboutUsList.count().exec(function (err, data) {
//                     AboutUsList.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                         console.log(data, 6666,listdata)
//                         resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                         // resolve({'listSum': data, 'listdata': listdata})
//                     })
//                 })
//                 break;
//             case "search":
//                 AboutUsList.count({'name': {'$regex': ctx.request.body.search}}).exec(function (err, data) {
//                     AboutUsList.find({'name': {'$regex': ctx.request.body.search}}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                         console.log(data, listdata, 'search')
//                         resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                         // resolve({'listSum': data, 'listdata': listdata})
//                     })
//                 })
//                 break;
//             case "delete":
//                 AboutUsList.remove({_id: ctx.request.body._id}).exec(function (err, data) {
//                     console.log(data, 'delete')
//                     resolve({status: 'ok', msg: '成功删除'})
//                 })
//                 break;
//             default:
//                 break;
//             // 与 case 1 和 case 2 不同时执行的代码
//         }
//     })
// }
//
// var WebsiteInformation = async (ctx, next) => {
//     ctx.body = await WebsiteInformationFn(ctx)
// }
// async function WebsiteInformationFn(ctx) {
//     return new Promise((resolve, reject) => {
//         switch (ctx.request.body.type) {
//             case "add":
//                 delete ctx.request.body.type;
//                 WebsiteInformationModel.create(Object.assign(ctx.request.body), function (err, data) {
//                     if (err){
//                         console.log(err)
//                         resolve({status: 'err', msg: '添加失败'});
//                     }
//                     console.log(data, 'add')
//                     resolve({status: 'ok', msg: '修改成功'})
//                 });
//                 break;
//             case "edit":
//                 delete ctx.request.body.type;
//                 WebsiteInformationModel.find({_id: ctx.request.body._id}, function (err, data) {
//                     delete ctx.request.body._id;
//                     for(var i in ctx.request.body){
//                         data[0][i]=ctx.request.body[i]
//                     }
//                     data[0].save();
//                     resolve({status: 'ok', msg: '修改成功'})
//                 });
//                 break;
//             case "query":
//                 delete ctx.request.body.type
//                     WebsiteInformationModel.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                         console.log(listdata)
//                         resolve({status: 'ok', data: listdata})
//                     })
//                 break;
//             default:
//                 WebsiteInformationModel.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.request.body.current != undefined ? ((ctx.request.body.current - 1) * 10) : 0).exec(function (err, listdata) {
//                     console.log(listdata)
//                     resolve({status: 'ok', data: listdata})
//                 })
//                 break;
//             // 与 case 1 和 case 2 不同时执行的代码
//         }
//     })
// }
// var editPassword = async (ctx, next) => {
//     ctx.body = await editPasswordFn(ctx)
// }
// async function editPasswordFn(ctx) {
//     return new Promise((resolve, reject) => {
//         switch (ctx.request.body.type) {
//             case "edit":
//                 delete ctx.request.body.type;
//                 user.find({_id: ctx.request.body._id}, function (err, data) {
//                 try {
//                     delete ctx.request.body._id;
//                     // for(var i in ctx.request.body){
//                     //     data[0][i]=ctx.request.body[i]
//                     // }
//                     data[0]['password']=md5(ctx.request.body.password)
//                     data[0].save();
//                     resolve({status: 'ok', msg: '修改成功'})
//                 }catch (e) {
//                     resolve({status: 'err', msg: '修改失败，未获取到当前用户ID'})
//                 }
//                 });
//                 break;
//             default:
//                 break;
//             // 与 case 1 和 case 2 不同时执行的代码
//         }
//     })
// }
// var articleIn = async (ctx, next) => {
//     ctx.body = await articleInFn(ctx)
// }
// async function articleInFn(ctx) {
//     return new Promise((resolve, reject) => {
//         articleList.count().exec(function (err, data) {
//             articleList.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.query.current != undefined ? ((ctx.query.current - 1) * 10) : 0).exec(function (err, listdata) {
//                 console.log(data, listdata)
//                 resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                 // resolve({'listSum': data, 'listdata': listdata})
//             })
//         })
//     })
// }
// var AboutUsIn = async (ctx, next) => {
//     ctx.body = await AboutUsInFn(ctx)
// }
// async function AboutUsInFn(ctx) {
//     return new Promise((resolve, reject) => {
//         AboutUsList.count().exec(function (err, data) {
//             AboutUsList.find({}, {}).sort({"updatedAt": -1}).limit(10).skip(ctx.query.current != undefined ? ((ctx.query.current - 1) * 10) : 0).exec(function (err, listdata) {
//                 console.log(data, listdata)
//                 resolve({status: 'ok', data: {total: data, listdata: listdata}})
//                 // resolve({'listSum': data, 'listdata': listdata})
//             })
//         })
//     })
// }
module.exports = {
    // 'POST /signin': fn_signin,
    // 'POST /getMenu': getMenu,
    // 'POST /userReg':  userReg,
    // 'POST /userLogin': userLogin,
    // 'POST /article': article,
    // 'POST /AboutUs': aboutus,
    // 'POST /WebsiteInformation': WebsiteInformation,
    // 'POST /editPassword': editPassword,
    // 'GET /AboutUsIn': AboutUsIn,
    // 'GET /articleIn': articleIn,
    // 'GET /WebsiteIn': WebsiteInformation,
    'GET /': fn_index,
    'GET /about_us': about_us,
    'GET /tiger_list': tiger_list,
    'GET /tiger_talk': tiger_talk,
    'GET /tiger_introduction': tiger_introduction,
};

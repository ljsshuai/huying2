var http=require('https');
var cheerio=require('cheerio');
var request=require('request');
var fs=require('fs');
var mongoose = require('mongoose');
// var saveNewsMongo=require('./models/news');
var schedule = require("node-schedule");
var url=require('../config/config');
var iconv = require('iconv-lite');
var supplyNewsClass=require('./models/supplyNewsClass');
var saveArticle=require('./models/saveArticle');
// var bookClassify=require('./models/bookClassify');
mongoose.connect(url.supplyMongodbUrl,function(err){
    if(err){
        console.log('数据库连接失败')
        return false
    }
    console.log('数据库连接成功')
});
var rule     = new schedule.RecurrenceRule();
var num=0;
var isFor=true
// (async function(){
async function test(){
    // for (var i=12350;i<20000;i++){
    // console.log(i)
    httpGet("https://www.huoyuanjd.com/news/");
    await new Promise((resolve, reject) => {

        if(isFor==true){
            setTimeout(function(){
                resolve()
            },1000)


        }
    })
    // }
}
test()
// })


rule.minute =[0,20,40];
// ;
schedule.scheduleJob(rule, function(){
    httpGet();
});


// httpGet();
function httpGet(url){
    isFor==false
    http.get(url,function(res){
        if(res.statusCode==200){
            var html='';
            res.on('data',function(data){
                html+=iconv.decode(data, 'utf-8')
            });
            res.on('end',function(){
                console.log('数据采集整理中')
                filterHtml(html)
            });
        }
    }).on('error',function(err){
        console.log(err)
    })
}

async function supplyNewsClassFn(NewsClassName){
    return new Promise((resolve, reject) =>{
            try {
                //查询数据库文章分类中有没有此条文章  没有就插入，不管有没有都要返回一个ID 给下个PROMISE做文章列表采集
                supplyNewsClass.find({name:NewsClassName},function(err,res){
                    if(res.length==0){
                        supplyNewsClass.create({name:NewsClassName},function(err,data){
                            resolve(data._id)
                        })
                    }else{
                        resolve(res[0]._id)
                    }
                    // res.forEach(function(val){
                    //     if(resData.indexOf(val.name)!=-1){
                    //         // isArray.push(dataArray.indexOf(val.name))
                    //         resData.splice(resData.indexOf(val.name),1)
                    //     }
                    // })
                    // var newdataArray=[];
                    // resData.forEach(function(val){
                    //     newdataArray.push({name:val})
                    // })

                });
            }catch (e) {
                reject(e)
            }
        }
    )
}



async function SaveImages(url){
    return   new Promise((resolve, reject) =>{
        try {
            var newUrl=url.substring(0,url.lastIndexOf('/'))
            var catalogName=newUrl.substring(newUrl.lastIndexOf('/')+1,newUrl.length);
            url.indexOf('?')!=-1?url=url.substring(0,url.indexOf('?')-1):null;
            fs.readdir('../../public/images/'+catalogName, function(err){
                if(err) {
                    fs.mkdir('../../public/images/'+catalogName, function(err){
                        if(err){
                            console.log(err,99999)
                        }else{
                            try {
                                request(url).pipe(fs.createWriteStream('../../public/images/'+catalogName+'/'+url.substring(url.lastIndexOf('/')+1,url.length)))
                                resolve()
                            }catch (e) {
                                console.log("图片保存错误")
                                resolve()
                            }
                        }
                    })
                }else{
                    try {
                        request(url).pipe(fs.createWriteStream('../../public/images/'+catalogName+'/'+url.substring(url.lastIndexOf('/')+1,url.length)))
                        resolve()
                    }catch (e) {
                        console.log("图片保存错误")
                        resolve()
                    }
                }
            })
        }catch (e) {
            resolve()
        }

    })
}

async function reqBookList(url){
    return   new Promise((resolve, reject) =>
        request({url:url,encoding: null,}, function (error, response, body) {
            try {
                if(body==undefined){
                    resolve();
                }else{
                    var sectionList={
                        affiliation:_id,
                        sectionList:[]
                    };
                    var $=cheerio.load(iconv.decode(body,'gbk'));
                    // console.log($('table').find('td').text())
                    $('table').find('td').each(function(i,val){
                        var sectionListD={
                            url:$(val).find('a').attr('href'),
                            name:$(val).text()
                        };
                        sectionList.sectionList.push(sectionListD)
                    })
                    resolve(sectionList,_id)
                }
            }catch (e) {
                reject(e)
                console.log(e,error,1111,body)
            }
        })
    );
}

async function getMenuChild(str,NewsClassID){
    return new Promise((resolve, reject) => {
        (async () => {
            // supplyNewsClass
            await ChildList(str,NewsClassID)
            resolve()
        })();
    })
}
async function ChildList(str,NewsClassID){
    return new Promise((resolve, reject) => {
        request({url:'http://'+str,encoding: null,}, function (error, response, body) {
            try {
                if(body==undefined){
                    resolve();
                }else{
                    var $=cheerio.load(iconv.decode(body,'utf-8'));
                    //获取到主菜单进来的列表 获取第一条最新的文章数据。再进入此页面获取他的页面数据，然后在获取上下翻页中的上一条数据地址；
                    (async () => {
                        // supplyNewsClass
                        await  previousHmtl('http://'+str.substring(0,17)+$('.top_t').first().find('a').attr('href'),NewsClassID);
                        resolve()
                    })();
                }
            }catch (e) {
                reject(e)
                console.log(e,error,1111,body)
            }
        })
    })
}

async function  previousHmtl(str,NewsClassID){
    return new Promise((resolve, reject) => {
        function requestFn(str,NewsClassID){
            request({url:str,encoding: null,}, function (error, response, body) {
                try {
                    if(body==undefined){
                        // console.log(body)
                        // resolve();
                    }else{
                        (async () => {
                            var $=cheerio.load(iconv.decode(body,'utf-8'));
                            var saveData={
                                title:$('.news_title h1').text(),
                                subImages:editSubImages(),
                                content:$('.news_xw_Desc').html().indexOf('https://www.huoyuanjd.com/d/file/')!=-1?$('.news_xw_Desc').html().replace(/https:\/\/www.huoyuanjd.com\/d\/file\//g,'//127.0.0.1:3333/serverPublic/images/').replace(/<a href="https:\/\/www.huoyuanjd.com"/g,'<a href="javascript:;"'):$('.news_xw_Desc').html(),
                                readNum:Math.floor(Math.random()*100+1),
                                description:editDesc(),
                                classifyId:NewsClassID
                            };
                            function editDesc(){
                                if($('.news_xw_Desc p').first().html()!=undefined||$('.news_xw_Desc p').first().html()!=null){
                                    return $('.news_xw_Desc p').first().html().indexOf('href="https:\/\/www.huoyuanjd.com')!=-1?$('.news_xw_Desc p').first().html().replace(/href="https:\/\/www.huoyuanjd.com"/g,'href="javascript:;"'):$('.news_xw_Desc p').first().html()
                                }

                            }

                            //https://www.huoyuanjd.com/data/upload/ueditor/20180605/5b1631bcce953.jpg

                            function editSubImages(){
                                var newSubImage='';
                                if($('.news_xw_Desc').find('img').attr('src')!=undefined){
                                    if($('.news_xw_Desc').find('img').attr('src').indexOf('https://www.huoyuanjd.com/d/file/')!=-1){
                                        newSubImage=$('.news_xw_Desc').find('img').attr('src').replace(/https:\/\/www.huoyuanjd.com\/d\/file\//g,'./serverPublic/images/');

                                    }
                                    if($('.news_xw_Desc').find('img').attr('src').indexOf('https://www.huoyuanjd.com/data/upload/ueditor/')!=-1){
                                        newSubImage=$('.news_xw_Desc').find('img').attr('src').replace(/https:\/\/www.huoyuanjd.com\/data\/upload\/ueditor\//g,'./serverPublic/images/');
                                    }
                                    return 	newSubImage
                                }
                            }
                            saveArticle.find({title:saveData.title},function(err,res){
                                if(res[0]==undefined){
                                    saveArticle.create(saveData,function(err,data){
                                        if(!err) console.log('成功添加书名：'+saveData.title)

                                        // resolve(data._id)
                                    });
                                }else{
                                    // throw '数据存在不添加';
                                    console.log('该条信息数据库已存在')
                                    // resolve()
                                }
                            });
                            if($('.news_xw_Desc').find('img').length>1){
                                var imgArray=[];
                                $('.news_xw_Desc').find('img').each((i,val)=>{
                                    imgArray.push($(val).attr('src'))
                                })
                                for (var i in imgArray){
                                    await SaveImages(imgArray[i]);
                                }
                            }else{
                                $('.news_xw_Desc').find('img').attr('src')!=undefined?await SaveImages($('.news_xw_Desc').find('img').attr('src')):null;
                            }
                            if($('.sxp a').first().text()!='返回列表'){
                                requestFn(str.substring(0,24)+$('.sxp a').first().attr('href'),NewsClassID)
                            }else{
                                resolve()
                            }
                        })();
                    }
                }catch (e) {
                }
            })
        }
        requestFn(str,NewsClassID);
    })
}


async function filterHtml(html){
    try {
        var $=cheerio.load(html);
        var ulArray=[];
        $('.ppme2 ul').find('li a').each((i,val)=>{
            ulArray.push({name:$(val).text(),src:$(val).attr('href').substring(2)});
        });
        for (let val in  ulArray){
            var NewsClassID=await supplyNewsClassFn(ulArray[val].name)
            await getMenuChild(ulArray[val].src,NewsClassID)
        }
        var resData={
            menuList:[],
            name:$('#content').find('dd').first().text().substr(0,$('#content').find('dd').first().text().length-5), //小说名称
            state:$('#content tbody').find('tr').first().find('td').last().text().substr(1) , //状态
            author:$('#content tbody').find('tr').first().find('td').first().next().next().text().substr(1),
            //作者
            collect:$('#content tbody').find('tr:nth-child(2)').find('td:nth-child(2)').text().substr(1), //收藏数
            extent:parseFloat($('#content tbody').find('tr:nth-child(2)').find('td:nth-child(4)').text().substr(1)), //文章长度
            lastTime:$('#content tbody').find('tr:nth-child(2)').find('td:nth-child(6)').text().substr(1),//最后更新时间
            hits:$('#content tbody').find('tr:nth-child(3)').find('td:nth-child(2)').text().substr(1),  //点击数
            recommend:$('#content tbody').find('tr:nth-child(4)').find('td:nth-child(2)').text().substr(1), //推荐数
            Category: $('#content tbody').find('tr').first().find('td').first().text().substr(1), //文章类别
            intro:$('#content table').next().text().substr(4), //简介
            keyword:[], //关键字
            picture:''//封面图片
        }
        // $('#content table').next().next().next().next().find('u').each(function(i,val){
        //     resData.keyword.push($(val).text())
        // })
        //$('.m_menu li a').each(function(i,val){  //暂不调用存储小说菜单分类
        //     resData.menuList.push($(val).text())
        // })
        // savebookClassify(resData.menuList)


        // console.log('保存小说列表')
        // await saveBookListFn(resData).then(data=>{
        //     SaveImages($('.hst img').attr('src'),data)
        //     return reqBookList($('#content').find('dd:nth-child(3)').find('div').last().find('.btnlinks a:first-child').attr('href'),data)
        // }).then(sectionList=>{
        //     saveSectionListFn(sectionList)
        // } )
    }catch (e) {
        console.log(e)
    }
}
function updateStr(str){
    return '.'+str.substring(str.lastIndexOf('/')-9,str.length)
}


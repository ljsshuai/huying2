var Koa = require('koa');
var KoaServer = new Koa();
const session = require('koa-session');
var controllers = require('./routerControllers')
var APIcontrollers = require('./ApiControllers')
var koaStatic = require('koa-static');
var path = require('path');
var views = require('koa-views');
var logger = require('Koa-logger');
var compress = require('koa-compress');
var mongoose = require('mongoose')
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const url = 'mongodb://zzh:zhihong@139.199.209.205/hyWebsite';
const proxy = require('koa-proxies');
const mount = require('koa-mount');
const serverPulicApp = new Koa();
const clientPulic = new Koa();
const serverApi = new Koa();
const multer = require('koa-multer');
const koaJwt=require('koa-jwt');
const config=require('../public/config');
const tokenVer=require('./models/util/tokenVer')
var KoaRoute = require('koa-router')({
    prefix: '/upload'
});
mongoose.connect(url, function (err) {
    if (err) {
        console.log('连接错误')
        return false
    }
    console.log('数据库连接成功')
});
//配置
var storage = multer.diskStorage({
        //文件保存路径
        destination: function (req, file, cb) {
            cb(null, '../public/images/')
        },
        //修改文件名称
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    }
);
const upload = multer({storage: storage});
KoaRoute.post('/', upload.single('file'), async (ctx, next) => {

    ctx.body = {
        uid: Date.now(),      // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name: ctx.req.file.filename,   // 文件名
        status: 'done', // 状态有：uploading done error removed
        response: '{"status": "success"}', // 服务端响应内容
        linkProps: '{"download": "image"}', // 下载链接额外的 HTML 属性
    }
})
KoaServer.use(cors())
KoaServer.use(KoaRoute.routes());
KoaServer.use(mount('/serverPublic', serverPulicApp));
KoaServer.use(mount('/public', clientPulic));
clientPulic.use(koaStatic(path.join(__dirname, '../dist/client'), {index: false}));//子路由下的静态文件处理
serverPulicApp.use(koaStatic(path.join(__dirname, '../public'), {index: false}));//子路由下的静态文件处理
KoaServer.use(koaStatic(path.join(__dirname, '/views/dist'), {index: false}));//主路由静态文件处理
KoaServer.use(koaBody({multipart: true, json: true}))
KoaServer.use(logger())
KoaServer.use(compress())
KoaServer.use(views(__dirname + '/views/dist', {extension: 'ejs'}));

serverApi.use(tokenVer());
serverApi.use(koaJwt({secret:config.secret}).unless({
    path: ['/api/userLogin','/api/WebsiteIn','/api/articleIn','/api/AboutUsIn'] //数组中的路径不需要通过jwt验证
}));
KoaServer.use(mount('/api', serverApi));

KoaServer.use(async function (ctx, next) {
    console.log(ctx.url)
    if (ctx.path === '/favicon.ico') return;
    await next();
}).listen(config.port);

serverApi.use(APIcontrollers());

KoaServer.use(controllers());

KoaServer.on('error', function (err, ctx) {
    // console.log(err);
});


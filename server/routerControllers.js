var fs=require('fs');


function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET')) {
            var path = url.substring(4);
            router.get(path, mapping[url])


        } else if (url.startsWith('POST')) {
            var path = url.substring(5);
            router.post(path, mapping[url])
        } else {
            console.log(url + '不是GET POST')
        }
    }
}
function addControllers(router) {
    var JsFiles = fs.readdirSync(__dirname + '/controllers').filter((f) => {
        return f.endsWith('.js');
    });
    for (var i of JsFiles) {
        var mapping = require(__dirname + '\\controllers\\' + i);
        addMapping(router,mapping)
    }
}
module.exports = function (dir) {
    let controllers_dir = dir || '\\controllers\\';
    var KoaRoute = require('koa-router')();
    addControllers(KoaRoute,controllers_dir);
    return  KoaRoute.routes();
}
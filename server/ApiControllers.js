var fs=require('fs');
function apiaddMapping(router, mapping) {
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
function apiaddControllers(router) {
    var JsFiles = fs.readdirSync(__dirname + '/ApiControllers').filter((f) => {
        return f.endsWith('.js');
    });
    for (var i of JsFiles) {
        var mapping = require(__dirname + '\\ApiControllers\\' + i);
        apiaddMapping(router,mapping)
    }
}
module.exports = function (dir) {
    let controllers_dirApi = dir || '\\ApiControllers\\';
    var ApiRoute = require('koa-router')();
    apiaddControllers(ApiRoute,controllers_dirApi);
    return  ApiRoute.routes();
}
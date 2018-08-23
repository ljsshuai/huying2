function jsonp(setting) {
    if (!setting) {
        return false;
    }
    setting.data = setting.data || {}
    setting.key = setting.key || 'callback'
    setting.callback = setting.callback || function() {}
    setting.data[setting.key] = '__onGetData__'

    window.__onGetData__ = function(data) {
        setting.callback(data);
    }
    var script = document.createElement('script')
    var query = []
    for (var key in setting.data) {
        query.push(key + '=' + encodeURIComponent(setting.data[key]))
    }
    script.src = 'http://43.246.214.1/zjh/' + setting.url + '?' + query.join('&')
    document.head.appendChild(script)
    document.head.removeChild(script)
}
// jsonp({
//     url: 'http://139.199.77.158/zjh/admin/in/login',
//     key: 'callback',
//     data: { page: 1, cate: 'recommend' },
//     callback: function(ret) {
//         console.log(ret)
//     }
// })

jsonp.prototype.serverSrc = 'http://43.246.214.1/zjh/'

export var serverSrc = "http://43.246.214.1/zjh/";
export default jsonp;
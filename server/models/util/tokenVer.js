const jwt = require('jsonwebtoken')
const config = require('../../../public/config')
const util = require('util')
const verify = util.promisify(jwt.verify)

/**
 * 判断token是否可用
 */
module.exports = function () {
    return async function (ctx, next) {
        console.log(ctx.url)
        try {
            const token = ctx.header.authorization||ctx.request.body._token  // 获取jwt
            if(token) {
                let payload
                try {
                    payload = await verify(token.split(' ')[1], config.secret)  // 解密payload，获取用户名和ID
                    ctx.user = {
                        name: payload.name,
                    }
                } catch (err) {
                    ctx.body = {
                        status:'err',
                        code: -1,
                        msg: '认证失败'+err.TokenExpiredError
                    }
                    console.log('token verify fail: ', err)
                }
            }
            await next()
        } catch (err) {
            if (err.status === 401) {
                ctx.body = {
                    code: -1,
                    msg: 'token错误或者已过期请重新登录'
                }
            } else {
                err.status = 404
                ctx.body = '404'
            }
        }
    }
}

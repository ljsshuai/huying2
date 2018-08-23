var md5 = require('md5');
export default function (content){
    return md5('message2018' + content)
}
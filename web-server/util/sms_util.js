import md5 from 'blueimp-md5'
import moment from 'moment'
import {Base64} from 'js-base64'
import request from 'request'

/*生成指定长度的随机数*/
function randomCode(length) {
    let chars = ['0','1','2','3','4','5','6','7','8','9'];
    let result = ""; 
    for(let i = 0; i < length ; i ++) {
        let index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}

/*向指定号码发送指定验证码*/
function sendCode(phone, code, callback) {
    let ACCOUNT_SID = '************';
    let AUTH_TOKEN = '************';
    let Rest_URL = 'https://app.cloopen.com:8883';
    let AppID = '************';
    //1. 准备请求url
    /*
     使用MD5加密（账户Id + 账户授权令牌 + 时间戳）。其中账户Id和账户授权令牌根据url的验证级别对应主账户。
     时间戳是当前系统时间，格式"yyyyMMddHHmmss"。时间戳有效时间为24小时，如：20140416142030
     2.SigParameter参数需要大写，如不能写成sig=abcdefg而应该写成sig=ABCDEFG
     */
    let sigParameter = '';
    let time = moment().format('YYYYMMDDHHmmss');
    sigParameter = md5(ACCOUNT_SID+AUTH_TOKEN+time);
    let url = Rest_URL+'/2013-12-26/Accounts/'+ACCOUNT_SID+'/SMS/TemplateSMS?sig='+sigParameter;

    //2. 准备请求体
    let body = {
        to : phone,
        appId : AppID,
        templateId : '1',
        "datas":[code,"1"]
    }

    //3. 准备请求头
    /*
     a.使用Base64编码（账户Id + 冒号 + 时间戳）其中账户Id根据url的验证级别对应主账户
     b.冒号为英文冒号
     c.时间戳是当前系统时间，格式"yyyyMMddHHmmss"，需与SigParameter中时间戳相同。
     */
    let authorization = ACCOUNT_SID + ':' + time;
    authorization = Base64.encode(authorization);
    let headers = {
        'Accept' :'application/json',
        'Content-Type' :'application/json;charset=utf-8',
        'Content-Length': JSON.stringify(body).length+'',
        'Authorization' : authorization
    }

    //4. 发送请求, 并得到返回的结果, 调用callback
    request({
        method : 'POST',
        url : url,
        headers : headers,
        body : body,
        json : true
    }, (error, response, body) => {
        console.log(error, response, body);
        callback(body.statusCode==='000000');
    });
}

export default {
    randomCode,
    sendCode
}

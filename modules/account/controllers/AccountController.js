/**
 * ProjectName: ztc-test
 * FileName: account.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/28
 * Description:
 */

'use strict';
const accountProxy = require('../modules/AccountProxy');
const ZController = require('../../../common/ZController');
const ZCommon = require('../../../common/ZCommon');
const errorCodeTable = require('../../../common/errorCodeTable');
const common = new ZCommon();

function isValidData(info, isCreate){
    //参数格式判断
    let ret = {is: true, error: null};
    if(!common.isJson(info)){
        ret.error = new Error();
        ret.error.name = 'SyntaxError';
        ret.error.status = 400;
        ret.error.code = 1054;
        ret.error.message = errorCodeTable.errorCode2Text(ret.error.code);
        ret.error.description = 'The data is not json format.';
    }

    if(isCreate)
        ret.error = common.mandatoryParams(info, ['account', 'username', 'password', 'status']);
    else
        ret.error = common.mandatoryParams(info, ['account', 'username', 'status']);
    if (ret.error) {
        ret.is = false;
        return ret;
    }
    return ret;
}

async function isExist(info){
    try{
        let result = await accountProxy.find({account: info.account});
        return {'is': result.length == 0 ? false : true, description: '', infos: result}
    }catch(err){
        return err;
    }
}

function retData(body){
    body.href = 'http://localhost:3000/accounts/' + body.id;
    return body;
}

module.exports = new ZController(accountProxy, isValidData, isExist, retData, null, null, null);
/**
 * ProjectName: ztc-test
 * FileName: account.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/28
 * Description:
 */

'use strict';
const ZCommon = require('../../../common/ZCommon');
const accountProxy = require('../modules/AccountProxy');

class AccountController{
    constructor(){

    }
    async create(ctx, next){
        try{
            let result = await accountProxy.create(ctx.body);
            ctx.body = result;
            ctx.status = 201;
        }catch(err){
            ctx.body = err;
            ctx.status = 500;
        }
    }
}

module.exports = new AccountController();
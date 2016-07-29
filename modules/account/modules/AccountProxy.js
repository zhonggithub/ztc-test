/**
 * ProjectName: ztc-test
 * FileName: AccountProxy.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/29
 * Description:
 */
'use strict';

const ZRresourceOperator = require('../../../common/ZResourceOperator');
const orm = require('../../MongodbOrm');

function getAccountModule(){
    return orm.collections().tb_account;
}

class AccountProxy extends ZRresourceOperator{
    constructor(){
        super();
    }

    async create(dbInfo, callback){
        try{
            let result = await getAccountModule().create(dbInfo);
            callback(null, result);
        }catch(error){
            callback(error);
        }
    }
}

module.exports = new AccountProxy();
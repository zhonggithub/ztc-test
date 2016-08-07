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
const ZResourceDB = require('../../../common/ZResourceDB');
const ZCommon = require('../../../common/ZCommon');
const common = new ZCommon();
const accountDB = new ZResourceDB(getAccountModule);

function getAccountModule(){
    return orm.collections().tb_account;
}

function convertQueryCriteria(criteria){
    let tmpCriteria = JSON.parse(JSON.stringify(criteria));
    tmpCriteria = common.convertQueryCriteria(tmpCriteria);
    let dbCriteria = tmpCriteria.dstCriteria;
    tmpCriteria = tmpCriteria.sourceCriteria;
    for (let condition in tmpCriteria) {
        switch (condition) {
            case "username":
            {
                if (tmpCriteria[condition].indexOf('*') == -1){
                    dbCriteria['canton.' + condition] = tmpCriteria[condition];
                }
                else {
                    let reg = /\*/g;
                    let str = criteria[condition].replace(reg, '%');
                    dbCriteria['canton.' + condition] = {'like': str};
                }
            }break;
            default:
                dbCriteria[condition] = tmpCriteria[condition];
                break;
        }
    }
    dbCriteria['deleteFlag'] = {'!': 1};
    return dbCriteria;
}

function convertCountCriteria(criteria){
    let dbCriteria = common.convertCountCriteria(criteria);
    dbCriteria['deleteFlag'] = {'!': 1};
    return dbCriteria;
}

module.exports = new ZRresourceOperator(accountDB, null, null, null, convertQueryCriteria, convertCountCriteria);
/**
 * ProjectName: zcmex
 * FileName: ZResourceOperator.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/22
 * Description:
 */
'use strict';

const ZCommon = require('./ZCommon');
let packageOfOperatorImp = {
};
let imp = {};

function convert2DBInfo(logicInfo){
    let dbInfo = (imp.ResourceDBInfo ? new imp.ResourceDBInfo(logicInfo, true) : logicInfo);
    return dbInfo;
}

function convert2LogicInfo(dbInfo){
    return (imp.ResourceLogicInfo ? new imp.ResourceLogicInfo(dbInfo) : dbInfo);
}

class ZResourceOperator{
    constructor(resourceDB, ResourceLogicInfo, ResourceDBInfo, ResourceUpdateDBInfo, convertQueryCriteria, convertCountCriteria){
        packageOfOperatorImp.resourceDB = resourceDB;
        packageOfOperatorImp.convertQueryCriteria = convertQueryCriteria;
        packageOfOperatorImp.convertCountCriteria = convertCountCriteria ? convertCountCriteria : convertQueryCriteria ;
        packageOfOperatorImp.ResourceLogicInfo = ResourceLogicInfo;
        packageOfOperatorImp.ResourceDBInfo = ResourceDBInfo;
        packageOfOperatorImp.ResourceUpdateDBInfo = ResourceUpdateDBInfo ? ResourceUpdateDBInfo : ResourceDBInfo;

        imp = packageOfOperatorImp;

        // imp = new Proxy(packageOfOperatorImp, {
        //     get: function(target, property) {
        //         if (property in target) {
        //             if(target[property] == undefined && target[property] == '')
        //                 return function(data){return data};
        //             else
        //                 return target[property];
        //         } else {
        //             throw new ReferenceError("Property \"" + property + "\" does not exist.");
        //         }
        //     }
        // });
    }

    async create(logicInfo){
        try{
            let dbInfo = convert2DBInfo(logicInfo);
            let result = await imp.resourceDB.createResource(dbInfo);
            return Promise.resolve(convert2LogicInfo(result));
        }catch(error){
            return Promise.reject(error);
        }
    }

    async updateById(id, logicInfo){
        try{
            let dbInfo = convert2DBInfo(logicInfo);
            let result = await imp.resourceDB.updateResource({id:id}, dbInfo);
            return Promise.resolve(convert2LogicInfo(result));
        }catch(error){
            return Promise.reject(error);
        }
    }

    async retrieveById(id){
        try{
            let result = await imp.resourceDB.retrieveResource({id: id});
            return Promise.resolve(convert2LogicInfo(result));
        }catch(error){
            return Promise.reject(error);
        }
    }

    async deleteById(id){
        try{
            let result = await imp.resourceDB.deleteResource({id: id});
            return Promise.resolve(result);
        }catch(error){
            return Promise.reject(error);
        }
    }

    async logicDeleteById(id){
        try{
            let result = await imp.resourceDB.logicDeleteResource({id: id});
            return Promise.resolve(result);
        }catch(error){
            return Promise.reject(error);
        }
    }

    async find(criteria) {
        try{
            let dbCriteria = imp.convertQueryCriteria(criteria);
            let results = await imp.resourceDB.findResource(dbCriteria);
            let infoArray = new Array();
            for(let i = 0; i < results.length; ++i){
                infoArray.push(convert2LogicInfo(results[i]));
            }
            return Promise.resolve(infoArray);
        }catch(error){
            return Promise.reject(error);
        }
    }
    async count(criteria){
        try{
            let dbCriteria = imp.convertCountCriteria(criteria);
            let size = await imp.resourceDB.count(dbCriteria);
            return Promise.resolve(size);
        }catch(error){
            return Promise.reject(error);
        }
    }
}
module.exports = ZResourceOperator;
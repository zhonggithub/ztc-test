/**
 * ProjectName: ztc-test
 * FileName: ZController.js
 * Version: 0.0.1
 * Author: Zz
 * Date : 2016/8/6
 * Description:
 */
'use strict';
const ZCommon = require('./ZCommon');
const common = new ZCommon();

let packageOfResourceProxy = {};

let prp = {};

class ZController{

    /**
     * @apiDescription  构造函数
     * @apiVersion 0.0.1
     *
     * @apiGroup ZController
     * @apiParam (input) {class} resourceProxy 操作资源的CRUD代理类
     * @apiParam (input) {function} isValidData 判断CU操作时的参数是否有效，形参为: ctx.request.body, isCreate，必须返回一个JSON体: {'is': true, 'error': '', 'flag':0}
     * @apiParam (input) {function} isExist  CU操作时判断资源唯一性，形参为ctx.request.body，必须返回一个JSON体: {'is': false, description: '', infos: []}
     * @apiParam (input) {function} retData CRU操作时封装返回客户端数据。形参为逻辑表现参的数据。
     * @apiParam (input) {function} retListData list操作时封装返回客户端的数据。新参为: ctx.request.query，满足条件的逻辑表现层数据items,满足条件在数据库的总条数size。
     * @apiParam (input) {function} isValidQueryParams list，R 操作判断ctx.request.query的有效性。
     * @apiParam (input) {function} isExpandValid 判断ctx.request.query中expand字段的有效性
     */
    constructor(resourceProxy, isValidData, isExist, retData, retListData, isValidQueryParams, isExpandValid){
        packageOfResourceProxy.rp = resourceProxy;
        packageOfResourceProxy.isValidData = isValidData;
        packageOfResourceProxy.isExist = isExist;
        packageOfResourceProxy.isValidQueryParams = isValidQueryParams;
        packageOfResourceProxy.isExpandValid = isExpandValid;
        packageOfResourceProxy.retData = retData;
        packageOfResourceProxy.retListData = retListData;

        prp = new Proxy(packageOfResourceProxy, {
            get: function(target, property) {
                if (property in target) {
                    if(!target[property] && property == 'isExist'){
                        return function(data){return {is : false, description: '', infos: []}};
                    }

                    if(!target[property] && property == 'retData'){
                        return function(data){return data};
                    }

                    if(!target[property] && property == 'retListData'){
                        return function(query, result, size){return {items: result, query: query, size: size}};
                    }

                    if(!target[property])
                        return function(data){
                            return {'is': true, 'error': '', 'flag':0, 'isExpand': false};//{is:true, error:null};
                        };
                    else
                        return target[property];
                } else {
                    throw new ReferenceError("Property \"" + property + "\" does not exist.");
                }
            }
        });
    }

    async create(ctx, next) {
        let body = ctx.request.body;
        let judge = prp.isValidData(body, true);
        if(!judge.is){
            common.koaErrorReturn(ctx.response, judge.error.status, judge.error);
            return;
        }
        try{
            let exist = await prp.isExist(body);
            if(exist.is){
                let err = common.error409();
                err.description = exist.description;
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            let result = await prp.rp.create(body);
            let retData = prp.retData(result);
            common.packageResOfCS(ctx.response, retData);
        }catch(err){
            common.koaErrorReturn(ctx.response, err.status, err);
        }
    }

    async update(ctx, next) {
        let body = ctx.request.body;
        let tmp = ctx.path.split('/');
        if(tmp.length == 0){
            let err = common.error500();
            err.description = 'the path is error.';
            common.koaErrorReturn(ctx.response, err.status, err);
            return;
        }
        body.id = tmp[tmp.length - 1];
        let judge = prp.isValidData(body);
        if(!judge.is){
            common.koaErrorReturn(ctx.response, judge.error.status, judge.error);
            return;
        }
        try{
            let exist = await prp.isExist(body);
            if(exist.is){
                let err = common.error409();
                err.description = exist.description;
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }

            let infos = await prp.rp.find({id: body.id});
            if(infos.length == 0){
                let err = common.error404();
                err.description = 'You can\'t to delete resource because the resource of url(' + ctx.url + ') is not exist.';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            if(infos.length != 1){
                let err = common.error409();
                err.description = 'You can\'t to delete resource because multiple resources exist when query by the resource of url(' + ctx.url+ ').';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            
            let result = await prp.rp.updateById(body.id, body);
            let retData = prp.retData(result[0]);
            common.packageResOfUS(ctx.response, retData);
        }catch(err){
            common.koaErrorReturn(ctx.response, err.status, err);
        }
    }

    async retrieve(ctx, next) {
        let judge = common.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, null);
        if(!judge.is){
            common.koaErrorReturn(ctx.response, judge.error.status, judge.error);
            return;
        }

        let tmp = ctx.path.split('/');
        if(tmp.length == 0){
            let err = common.error500();
            err.description = 'the path is error.';
            common.koaErrorReturn(ctx.response, err.status, err);
            return;
        }

        let id = tmp[tmp.length - 1];
        try{
            let result = await prp.rp.retrieveById(id);
            let retData = prp.retData(result);
            common.packageResOfCS(ctx.response, retData);
        }catch(err){
            common.koaErrorReturn(ctx.response, err.status, err);
        }
    }

    async delete(ctx, next) {
        let tmp = ctx.path.split('/');
        if(tmp.length == 0){
            let err = common.error500();
            err.description = 'the path is error.';
            common.koaErrorReturn(ctx.response, err.status, err);
            return;
        }

        let id = tmp[tmp.length - 1];

        try{
            let infos = await prp.rp.find({id: id});
            if(infos.length == 0){
                let err = common.error404();
                err.description = 'You can\'t to delete resource because the resource of url(' + ctx.url + ') is not exist.';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            if(infos.length != 1){
                let err = common.error409();
                err.description = 'You can\'t to delete resource because multiple resources exist when query by the resource of url(' + ctx.url+ ').';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            let result = await prp.rp.deleteById(id);
            common.packageResOfDS(ctx.response, result);
        }catch(err){
            common.koaErrorReturn(ctx.response, err.status, err);
        }
    }

    async logicDelete(ctx, next) {
        let tmp = ctx.path.split('/');
        if(tmp.length == 0){
            let err = common.error500();
            err.description = 'the path is error.';
            common.koaErrorReturn(ctx.response, err.status, err);
            return;
        }

        let id = tmp[tmp.length - 1];

        try{
            let infos = await prp.rp.find({id: id});
            if(infos.length == 0){
                let err = common.error404();
                err.description = 'You can\'t to delete resource because the resource of url(' + ctx.url + ') is not exist.';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            if(infos.length != 1){
                let err = common.error409();
                err.description = 'You can\'t to delete resource because multiple resources exist when query by the resource of url(' + ctx.url+ ').';
                common.koaErrorReturn(ctx.response, err.status, err);
                return;
            }
            let result = await prp.rp.logicDeleteById(id);
            common.packageResOfDS(ctx.response, result);
        }catch(err){
            common.koaErrorReturn(ctx.response, err.status, err);
        }
    }

    async list(ctx, next){
        common.consoleLog(ctx.request.query);
        let judge = common.isValidQueryParams(ctx.request.query, prp.isValidQueryParams, prp.isExpandValid);
        if(!judge.is){
            common.koaErrorReturn(ctx.response, judge.error.status, judge.error);
            return;
        }
        try{
            let result = await prp.rp.find(ctx.request.query);
            let size = await prp.rp.count(ctx.request.query);
            let retData = prp.retListData(ctx.request.query, result, size);
            common.packageResOfRS(ctx.response, retData);
        }catch(error){
            console.log(error);
            common.koaErrorReturn(ctx.response, error.status, error);
        }
    }
};
module.exports = ZController;
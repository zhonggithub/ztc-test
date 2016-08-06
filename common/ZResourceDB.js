/**
 * ProjectName: zcmex
 * FileName: ZResourceDB.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/22
 * Description:
 */
const logger = require('./log');
const ZCommon = require('./ZCommon');
const common = new ZCommon();

let packageOfResourceDBImp = {};

class ZResourceDB{
    constructor(getModuleFun){
        packageOfResourceDBImp.getModule = getModuleFun;
    }

    async createResource(dbInfo, callback) {
        try{
            let result = await packageOfResourceDBImp.getModule().create(dbInfo);
            return Promise.resolve(result);
        }catch(err){
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async updateResource(criteria, dbInfo) {
        try{
            let result = await packageOfResourceDBImp.getModule().update(criteria, dbInfo);
            return Promise.resolve(result);
        }catch(err){
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async retrieveResource(criteria) {
        try{
            let result = await packageOfResourceDBImp.getModule().findOne(criteria);
            return Promise.resolve(result);
        }catch(err){
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async deleteResource(criteria) {
        try{
            let result = await packageOfResourceDBImp.getModule().destroy(criteria);
            return Promise.resolve(result);
        }catch(err) {
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async logicDeleteResource(criteria){
        try{
            let result = await packageOfResourceDBImp.getModule().update(criteria, {deleteFlag: 1});
            return Promise.resolve(result);
        }catch(err) {
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async queryResource(queryStr) {
        try{
            let result = await packageOfResourceDBImp.getModule().query(queryStr);
            return Promise.resolve(result);
        }catch(err) {
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async findResource(criteria){
        try{
            let result = await packageOfResourceDBImp.getModule().find(criteria);
            return Promise.resolve(result);
        }catch(err) {
            logger.error(err);
            return Promise.reject(error);
        }
    }

    async count(criteria){
        try{
            let result = await packageOfResourceDBImp.getModule().count(criteria);
            return Promise.resolve(result);
        }catch(err) {
            logger.error(err);
            return Promise.reject(error);
        }
    }
}
module.exports = ZResourceDB;
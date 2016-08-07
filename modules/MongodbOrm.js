/**
 * ProjectName: zcmex
 * FileName: Orm.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/20
 * Description:
 */

'use strict';
const Waterline = require('waterline');
const mongodbAdapter = require('sails-mongo');
const log = require('../common/log');
const dbConfig = {
    adapters: {
        default: mongodbAdapter,
        mongodb: mongodbAdapter
    },
    connections: {
        mongodb: {
            adapter: 'mongodb',
            //url : 'mongodb://' + config.configForDB.connection.host + ':' + config.configForDB.connection.port + '/' + config.configForDB.connection.database
             host: 'localhost',
             port: 27017,
             //user: 'root',
             //password : '123456',
             database: 'ztc-test'
        }
    },
    defaults: {
        migrate: 'alter'
    }
};

class MongodbOrm{
    constructor(){
        this.orm = new Waterline();
        this.valid = false;
        this.models = null;
    }
    loadCollection(model){
        let tmpModel = Waterline.Collection.extend(model);
        this.orm.loadCollection(tmpModel);
        return this;
    }
    collections(){
        return this.models.collections;
    }
    init(){
        let _this = this;
        let promise = new Promise(function(resolve, reject){
            _this.orm.initialize(dbConfig, function(err, models){
                if(err){
                    reject(err);
                    return;
                }
                resolve(models);
            });
        });
        promise.then(function(result){
            _this.valid = true;
            _this.models = result;
        }).catch(function(err){
            _this.valid = false;
            _this.models = null;
            console.log(err);
            log.error(err);
        });
    }
}

const mongodbOrm = new MongodbOrm();

// ---- Account
mongodbOrm.loadCollection({
    identity: 'tb_account',
    tableName: 'tb_account',
    connection: 'mongodb',
    schema: true,
    attributes: {
        username : {
            type: 'string',
            defaultsTo: ''
        },
        account : {
            type: 'string',
            defaultsTo: ''
        },
        password : {
            type: 'string',
            defaultsTo: ''
        },
        status: {
            type: 'integer',
            defaultsTo: 0
        },
        deleteFlag : {
            type: 'integer',
            defaultsTo: 0
        }
    }
});

mongodbOrm.init();

module.exports = mongodbOrm;
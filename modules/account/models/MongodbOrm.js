/**
 * ProjectName: uwifiGaSystem
 * FileName: Orm.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/20
 * Description:
 */

'use strict';
const Waterline = require('waterline');
const mongodbAdapter = require('sails-mongo');
const config = require('../../common/config');
const log = require('../../../common/log');
const dbConfig = {
    adapters: {
        default: mongodbAdapter,
        mongodb: mongodbAdapter
    },
    connections: {
        mongodb: {
            adapter: 'mongodb',
            //url : 'mongodb://' + config.configForDB.connection.host + ':' + config.configForDB.connection.port + '/' + config.configForDB.connection.database
             host: config.configForDB.connection.host,
             port: config.configForDB.connection.port,
             user: config.configForDB.connection.user,
             password : config.configForDB.connection.password,
             database: config.configForDB.connection.database
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

// ---- place
mongodbOrm.loadCollection({
    identity: 'place',
    connection: 'mongodb',

    attributes: {
        uuid: 'string',
        number : 'string',
        name : 'string',
        location : 'array',
        canton : 'json',
        serviceType : 'string',
        businessNature : 'string',
        corRep: 'json',
        concatInfo : 'string',
        beginBusTime : 'string',
        endBusTime : 'string',
        orgCode : 'string',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer'  //0表示逻辑删除，非0表示有效
    },
    manufacturer:{
        collection: 'manufacturer',
        via: 'owner'
    },
    collectingDevice : {
        collection: 'collectingDevice',
        via: 'owner'
    }

});

// ---- Manufacturer
mongodbOrm.loadCollection({
    identity: 'manufacturer',
    connection: 'mongodb',

    attributes: {
        uuid: 'string',
        name : 'string',
        canton : 'json',
        contacts : 'json',
        orgCode : 'string',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer' //0表示逻辑删除，非0表示有效
    },

    owner: {
        model: 'place'
    }
});

// ---- User
mongodbOrm.loadCollection({
    identity: 'user',
    connection: 'mongodb',

    attributes: {
        uuid: 'string',
        name : 'string',
        password : 'string',
        account : 'string',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer' //0表示逻辑删除，1表示有效
    }
});

//---- CollectingDevice
mongodbOrm.loadCollection({
    identity: 'collectingdevice',
    connection: 'mongodb',

    attributes: {
        flag : 'integer',
        uuid : 'string',
        number : 'string',
        orgCode : 'string',
        location : 'array',
        name : 'string',
        canton : 'json',
        type : 'string',
        interval: 'integer',
        radii : 'integer',
        carNumber : 'string',
        metro : 'json',
        collectTimestamp: 'integer',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer' //0表示逻辑删除，非0表示有效
    },

    owner: {
        model: 'place'
    }
});

//--- hotspotinfo
mongodbOrm.loadCollection({
    identity: 'hotspotinfo',
    connection: 'mongodb',

    attributes: {
        mac : 'string',
        uuid : 'string',
        ssid : 'string',
        channel : 'string',
        encryptionType : 'string',
        collectTimestamp: 'integer',
        intensity : 'string',
        x : 'float',
        y: 'float',
        collectingDevice : 'json',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer' //0表示逻辑删除，非0表示有效
    },

    owner: {
        model: 'place'
    }
});

// --- terminalCharacteristicInfo
mongodbOrm.loadCollection({
    identity: 'terchatinfo',
    connection: 'mongodb',

    attributes: {
        uuid : 'string',
        terminalMac : 'string',
        ssidHistory : 'array',
        brand : 'string',
        collectTimestamp: 'integer',
        intensity : 'string',
        identityType: 'integer',
        identityContent: 'string',
        accessPoint: 'json',
        x : 'float',
        y: 'float',
        collectingDevice : 'json',
        createdAt: 'date',
        modifiedAt: 'date',
        status: 'integer' //0表示逻辑删除，非0表示有效
    },

    owner: {
        model: 'place'
    }
});

mongodbOrm.init();

module.exports = mongodbOrm;
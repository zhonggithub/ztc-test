/**
 * ProjectName: uwifiGaSystem
 * FileName: router.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/18
 * Description:
 */

'use strict';

const Router = require('koa-router');
const router = new Router();
const co = require('co');
const accounts = require('./modules/account/controllers/AccountController');

/* @ accounts (账号)*/
const baseAccountURL = '/api/:version/accounts';
router.post(baseAccountURL, accounts.create);
router.get(baseAccountURL + '/:accountUUID', accounts.retrieve);
router.get(baseAccountURL, accounts.list);
router.put(baseAccountURL + '/:accountUUID', accounts.update);
router.delete(baseAccountURL + '/:accountUUID', accounts.delete);

module.exports = router;
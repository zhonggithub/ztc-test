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
const accounts = require('./lib/controllers/Accounts');

/* @ accounts (账号)*/
const baseAccountURL = '/api/:version/accounts';
router.post(baseAccountURL, co.wrap(accounts.create));
router.get(baseAccountURL + '/:accountUUID', co.wrap(accounts.retrieve));
router.get(baseAccountURL, co.wrap(accounts.list));
router.put(baseAccountURL + '/:accountUUID', co.wrap(accounts.update));
router.delete(baseAccountURL + '/:accountUUID', co.wrap(accounts.delete));
router.post(baseAccountURL + '/loginAttempts', co.wrap(accounts.loginAttempts));
router.post(baseAccountURL + '/:accountUUID', co.wrap(accounts.restStatus));

module.exports = router;
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
const baseAccountURL = '/';
router.post(baseAccountURL, async (ctx, next)=>{
    console.log('=====');
    let n = await accounts.create(ctx.body);
});
// router.get(baseAccountURL + '/:accountUUID', co.wrap(accounts.retrieve));
// router.get(baseAccountURL, co.wrap(accounts.list));
// router.put(baseAccountURL + '/:accountUUID', co.wrap(accounts.update));
// router.delete(baseAccountURL + '/:accountUUID', co.wrap(accounts.delete));
// router.post(baseAccountURL + '/loginAttempts', co.wrap(accounts.loginAttempts));
// router.post(baseAccountURL + '/:accountUUID', co.wrap(accounts.restStatus));

module.exports = router;
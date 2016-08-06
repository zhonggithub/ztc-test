/**
 * ProjectName: uwifiGaSystem
 * FileName: uwinfiGaSystemServer.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/15
 * Description:
 */
'use strict';

const koa = require('koa');
const app = new koa();
const convert = require('koa-convert');
const bodyparser = require('koa-bodyparser')();
const json = require('koa-json');
const router = require('./router');
const logger = require('koa-logger');
const xtpl = require('xtpl/lib/koa');

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

xtpl(app, {views : './public/html'});
app.use(convert(logger()));
app.use(convert(bodyparser));
app.use(convert(json()));

// app.use(function*(next){
//     if(this.path == '/')
//         yield this.render('test',{"title":"xtemplate demo"});
//     else
//         yield next;
// });

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
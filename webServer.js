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
const config = require('./common/config');
const logger = require('koa-logger');
const xtpl = require('xtpl/lib/koa');

// app.use(function*(next){
//     var start = new Date;
//     yield next;
//     var ms = new Date - start;
//     this.set('X-Response-Time', ms + 'ms');
//     console.log('%s %s %s ms', this.method, this.path, ms);
// });

xtpl(app, {views : './public/html'});
app.use(convert(logger()));
app.use(convert(bodyparser));
app.use(convert(json()));

app.use(function*(next){
    if(this.path == '/')
        yield this.render('test',{"title":"xtemplate demo"});
    else
        yield next;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.port);
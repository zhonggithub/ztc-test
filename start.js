/**
 * ProjectName: ztc-test
 * FileName: start.js
 * Version: 0.0.1
 * Author: Zz
 * Date : 2016/7/28
 * Description:
 */
require("babel-core/register")(
    {
        presets: ['stage-3','es2015']
    }
);

require("babel-polyfill");
require("./webServer.js");
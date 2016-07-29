/**
 * ProjectName: ztc-test
 * FileName: test.js
 * Version: 0.0.1
 * Author: Zz
 * CreatedAt: 2016/7/28
 * Description:
 */
'use strict';

const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
    input: fs.createReadStream('1.txt')
});

let fd = fs.openSync('2.txt', 'w+');

rl.on('line', (line) => {
    let array = line.split(' ');
    for(let i = 0; i < array.length; ++i){
        if(array[i] == '')
            continue;
        if(i == 0){
            fs.writeSync(fd, '\'' + array[i].trim() + '\' : ');
        }else{
            fs.writeSync(fd, '\'' + array[i].trim() + '\', \r\n');
        }
    }
});
/**
 * Created by danxiang.feng on 2018/8/3.
 */
require('./src/ext/StringExt');
require('./src/ext/DateExt');

var child_process = require('child_process');


var appPack = require('./src/pack/AppPack')
var rnZipPack = require('./src/pack/RNZipPack')

var methods = {
    rn: packRNZip,
    app: packApp,
    python: python,
}


//脚本入口
main();

function main() {
    var params = process.argv.splice(2);

    var method = methods[params[0]];
    if (!method || typeof method != "function") {
        console.log('缺少必要参数   main具体方法名： ' + Object.keys(methods));
        return;
    }
    method(params)
}

//RN打包脚本  rn
function packRNZip(params) {
    rnZipPack.packRNZip(params[1])
}

//APP打包脚本  app
function packApp(params) {
    appPack.packApp(params[1], params[2], params[3])
}

function python() {
    var cmd_python = "e: && cd pythonTool && python MultiChannelBuildTool.py"
    child_process.exec(cmd_python, function (error, stdout, stderr) {
        if (error) {
            console.log('python    error: ', error, stderr)
            return
        }
        console.log('python    success')
    })

}




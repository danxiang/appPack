/**
 * Created by danxiang.feng on 2018/8/6.
 */
require('../ext/StringExt');
require('../ext/DateExt');

var fs = require('fs')
var path = require('path');
var child_process = require('child_process');
const TAG = "installApk:    "

const apkPath = "C:\\Users\\10556\\Desktop\\pack\\pythonTool\\output\\app-wisdom_1_0_0-marketDebug\\app-wisdom_1_0_0-marketDebug-wisdom_test.apk";

module.exports = {
    installApp: installApp,
}

main()

function main() {
    installApp(apkPath)
}


/**app安装脚本 install*/
function installApp(apkPath) {
    console.log(TAG, "start... " + new Date().format('yyyy-MM-dd hh:mm:ss'))
    if (!apkPath || apkPath.lastIndexOf(".apk") == -1) {
        console.log(TAG, "fail   无安装apk", apkPath)
        return
    }
    let installAppCMD = "adb install -r " + apkPath;
    console.log(TAG, "installAppCMD: " + installAppCMD);
    child_process.exec(installAppCMD, function (err, res, errRes) {
        if (err) {
            console.log(TAG, "fail ", err);
            return
        }
        console.log(TAG, "end... " + new Date().format('yyyy-MM-dd hh:mm:ss'))
    })
}

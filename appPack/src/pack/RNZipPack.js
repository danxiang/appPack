/**
 * Created by danxiang.feng on 2018/8/3.
 */

require('../ext/StringExt');
require('../ext/DateExt');
var fileUtil = require('../util/FileUtil')
var zipUtil = require('../util/zipUtil')

var fs = require('fs')
var path = require('path');
var child_process = require('child_process');

var TAG = 'RNZipPack:  ';

//根目录
const rootProjectPath = path.resolve(__dirname, '../../');

//RN项目根路径
var rnProjectPath = {
    market: 'E:\\workspace_android\\loan-market-react',  //华赞金服
    lender: 'E:\\workspace_android\\loan-lender-react',  //抢单侠
    xyzz  : 'E:\\XYZZ\\workspace\\intpay-market-react',  //信用转转
}

//RN打包的输出路径
var rnPackOutPath = {
    market: rootProjectPath + '/rnPackPath/market',  //华赞金服
    lender: rootProjectPath + '/rnPackPath/lender',  //抢单侠
    xyzz  : rootProjectPath + '/rnPackPath/xyzz',  //信用转转
}

/**
 * 导出方法
 */
module.exports = {
    packRNZip: packRNZip,
}

//脚本入口
//main();

function main() {
    var params = process.argv.splice(2);

    packRNZip(params[0])
}

/**
 * RNZip
 * @param curRNProject
 */
function packRNZip(curRNProject) {
    console.log(TAG, 'start...    ' + new Date().format('yyyy-MM-dd hh:mm:ss.S'));
    console.log(TAG, 'curRNProject: ' + curRNProject);

    if (!checkParams(curRNProject)) return

    var curRNProjectPath = rnProjectPath[curRNProject]
    var curRNPackOutPath = rnPackOutPath[curRNProject];

    console.log(TAG, 'curRNProjectPath: ' + curRNProjectPath);
    console.log(TAG, 'curRNPackOutPath: ' + curRNPackOutPath);

    removeImage(curRNPackOutPath)
    rnPack(curRNProjectPath, curRNPackOutPath, () => {
        zipUtil.zip(curRNPackOutPath, ()=>{  //压缩
            console.log(TAG, 'end...    ' + new Date().format('yyyy-MM-dd hh:mm:ss.S'));
        })
    })
}

function checkParams(curRNProject) {
    if (!curRNProject || !rnProjectPath[curRNProject]) {
        console.log(TAG, '参数异常： RN项目名称  ' + Object.keys(rnProjectPath));
        return false
    }
    return true
}

/**
 * 删除RN打包的输出路径中的原文件
 * @param curRNProject
 */
function removeImage(curRNPackOutPath) {
    console.log(TAG, '文件删除  start...   ' + curRNPackOutPath);
    if (!curRNPackOutPath) return

    if (!fs.existsSync(curRNPackOutPath)) {
        fs.mkdirSync(curRNPackOutPath)
    }

    fs.readdirSync(curRNPackOutPath).forEach(function (fileName) {
        if (fileName.endWith(".zip")) {
            return
        }
        if (!curRNPackOutPath.endWith("\\")) {
            curRNPackOutPath = curRNPackOutPath + "\\"
        }
        var filePath = curRNPackOutPath + fileName
        //console.log(TAG , "deleteFile: " + filePath)

        var statInfo = fs.statSync(filePath)
        if (statInfo.isDirectory()) {
            fileUtil.deleteDir(filePath)
        } else {
            fileUtil.deleteFile(filePath)
        }
    })
    console.log(TAG, '文件删除  end...');
}

/**
 * RN打包
 * @param curRNProject
 */
function rnPack(curRNProjectPath, curRNPackOutPath, callback) {
    if (!curRNProjectPath || !curRNPackOutPath) return

    //RN打包命令
    var rnPackCMD = 'react-native bundle --platform android --dev false --entry-file index.android.js '
        + '--bundle-output {0}/index.android.bundle '
        + '--assets-dest {0}';
    rnPackCMD = rnPackCMD.format(curRNPackOutPath);

    //RN打包命令
    var rnCMD = 'e: && cd ' + curRNProjectPath + ' && ' + rnPackCMD;
    console.log(TAG, 'RN pack start... ' + rnCMD);

    child_process.exec(rnCMD, function (error, stdout, stderr) {
        if (error) {
            console.log(TAG, '打包出错了, error: ', error, stderr);
            return
        }
        console.log(TAG, 'RN pack end...  ');

        callback && callback()
    });
}


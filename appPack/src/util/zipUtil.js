/**
 * Created by danxiang.feng on 2018/8/3.
 */

require('../ext/StringExt')
require('../ext/DateExt')
let fs = require('fs')

//https://blog.csdn.net/zeping891103/article/details/79268972

//npm install adm-zip    解压缩
var adm_zip = require('adm-zip');
//npm install archiver   压缩
var archiver = require('archiver');

var TAG = "ZIP:    "


/**文件压缩*/
var zipUtil = {
    zip: zip,
    unzip: unzip,
}
module.exports = zipUtil


/********************************   方法实现   ********************************************/

//压缩
function zip(pathStr, callback) {
    console.log(TAG + "zip start...   " + new Date().format('yyyy-MM-dd hh:mm:ss.S'))

    if (!pathStr) {
        console.log(TAG + "缺少待压缩文件的路径")
        return
    }
    if (!pathStr.endWith("\\")) {
        pathStr = pathStr + "\\"
    }

    var zipName = new Date().format('yyyy-MM-dd hh-mm-ss') + ".zip"
    var zipOutFile = pathStr + zipName

    console.log(TAG + "zipOutFile: " + zipOutFile)
    var zipOutput = fs.createWriteStream(zipOutFile);
    var archive = archiver('zip', {
            zlib: {
                level: 9   //压缩等级
            }
        }
    )

    // 'close' 事件监听   压缩结束
    zipOutput.on('close', function () {
        var total = archive.pointer()
        if (total > 1024 * 1024) {
            total = (total / 1024 / 1024).toFixed(2) + "MB"
        } else if (total > 1024) {
            total = (total / 1024).toFixed(2) + "KB"
        } else {
            total = total.toFixed(2) + "B"
        }
        console.log(TAG + "total: " + total)
        console.log(TAG + "zip end...   " + new Date().format('yyyy-MM-dd hh:mm:ss.S'))

        callback && callback()
    })

    // pipe 方法
    archive.pipe(zipOutput);

    // 'warnings' 事件监听
    archive.on('warning', function (err) {
        console.log(TAG + "zip warning: ", err);
    });

    // 'error' 事件监听
    archive.on('error', function (err) {
        console.log(TAG + "zip error: ", err);
        fs.unlink(zipOutFile)
    });

    fs.readdirSync(pathStr).forEach(function (fileName) {
        if (fileName.endWith(".zip")) {
            return
        }
        var filePath = pathStr + fileName
        //console.log(TAG + "ziFfile: " + filePath)

        archive.file(filePath, {name: fileName})

        var statInfo = fs.statSync(filePath)
        if (statInfo.isDirectory()) {
            archive.directory(filePath, fileName);
        }
    })

    // 添加一个目录，且文件放在根目录
    //archive.directory(pathStr, false);

    //执行
    archive.finalize()
}

//解压缩
function unzip(zipFilePath, unzipOutPath, callback) {
    console.log(TAG + "unzip start...   " + new Date().format('yyyy-MM-dd hh:mm:ss.S'))

    console.log(TAG + "unzip  zipFilePath: " + zipFilePath)
    console.log(TAG + "unzip  unzipPath: " + unzipOutPath)

    if (!zipFilePath || zipFilePath.length === 0) {
        console.log(TAG + "缺少待压缩文件的路径")
        return
    }
    if (!unzipOutPath || unzipOutPath.length === 0) {
        console.log(TAG + "缺少解压输出路径")
        return
    }

    var unzip = new adm_zip(zipFilePath);
    unzip.extractAllTo(unzipOutPath, true);

    console.log(TAG + "unzip end...." + new Date().format('yyyy-MM-dd hh:mm:ss.S'))
    callback && callback()
}




/************************  脚本测试    ********************/
//main();

function main() {
    var params = process.argv.splice(2);
    var method = params[0]

    switch (method) {
        case 'zip':
            zipUtil.zip(params[1])
            break
        case 'unzip':
            zipUtil.unzip(params[1],params[2]);
            break
        default:
            console.log(TAG + "缺少必要的参数   zip.js具体方法名：zip, unzip")
            break
    }
}

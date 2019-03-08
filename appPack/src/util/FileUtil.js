/**
 * Created by danxiang.feng on 2018/8/3.
 */
var fs = require('fs')


var fileUtil = {
    deleteDir : deleteDir,
    deleteFile: deleteFile
}
module.exports = fileUtil


/**删除文件夹*/
function deleteDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        var files = fs.readdirSync(dirPath)
        files.forEach(function (fileName, index) {
            var curPath = dirPath + "/" + fileName
            var statInfo = fs.statSync(curPath)
            if (statInfo.isDirectory()) { // dir
                deleteFolder(curPath)
            } else { // delete file
                fs.unlinkSync(curPath)
            }
        });
        fs.rmdirSync(dirPath)
    }
}

/**删除文件*/
function deleteFile(filePath){
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
    }
}
/**
 * Created by danxiang.feng on 2018/8/29.
 */

/**
 * Created by danxiang.feng on 2018/8/3.
 */
require('../ext/StringExt');
require('../ext/DateExt');

var fs = require('fs')
var child_process = require('child_process');

var TAG = 'AppPack:  ';

//Android项目根路径
var androidProjectPath = "E:\\workspace_android\\loan-market-android"
//RN项目根路径
var rnProjectPath = {
    market: 'E:\\workspace_android\\loan-market-react',  //华赞金服
    lender: 'E:\\workspace_android\\loan-lender-react',  //抢单侠
}

//Android打包环境
var env = {
    debug: 'debug',
    dev: 'dev',
    release: 'release'
}

/**
 * 导出方法
 */
module.exports = {
    packApp: packApp,
}

//脚本入口
//main();

function main() {
    var params = process.argv.splice(2);

    if (help(params)) return

    packApp(params[0], params[1], params[2])
}

/**
 * 帮助
 */
function help(params) {
    if (params.indexOf('help') == -1) {
        return false
    }
    var help = 'Android 打包脚本，先检查Android和RN代码，如果有更新则pull，如果本地有更新未提交则终止打包，手动push，然后打RN bundle包至Android项目中\n'
        + '   参数说明：'
        + '\n\t第一个参数为RN项目简称   ' + Object.keys(rnProjectPath)
        + '\n\t第二个参数为Android打包环境   ' + Object.keys(env)
        + '\n\t第三个参数为是否需要打RN包,默认为ture   '

    console.log(TAG, help)
    return true
}

function packApp(curRNProject, curEnv, isNeedPackRN) {
    console.log(TAG, 'start...    ' + new Date().format('yyyy-MM-dd hh:mm:ss.S'));
    console.log(TAG, 'curRNProject: ' + curRNProject + '   curEnv: ' + curEnv + "    isNeedPackRN: " + (isNeedPackRN != 'false'));

    if (!checkParmas(curRNProject, curEnv)) return

    var curAndroidProjectPath = androidProjectPath
    var curRNProjectPath = rnProjectPath[curRNProject]
    console.log(TAG, 'curAndroidProjectPath:  ' + curAndroidProjectPath);
    console.log(TAG, 'curRNProjectPath:       ' + curRNProjectPath);

    if(isNeedPackRN == 'false'){
        gradleBuild(curAndroidProjectPath, curRNProject, curEnv,()=>{
            console.log(TAG, 'end...    ' + new Date().format('yyyy-MM-dd hh:mm:ss.S'));
        })
        return
    }

    checkPullAndroid(curAndroidProjectPath, () => {
        checkPullRN(curRNProjectPath, () => {
            removeImage(curAndroidProjectPath)
            rnPack(curAndroidProjectPath, curRNProjectPath, () => {
                //rnGitCommit(curAndroidProjectPath,curRNProject)
                gradleBuild(curAndroidProjectPath, curRNProject, curEnv, () => {
                    rnGitReset(curAndroidProjectPath, () => {
                        console.log(TAG, 'end...    ' + new Date().format('yyyy-MM-dd hh:mm:ss.S'));
                    })
                })

            })
        })
    })
}

/**
 * 参数检验
 * @param params
 */
function checkParmas(curRNProject, curEnv) {
    if (!rnProjectPath[curRNProject]) {
        console.log(TAG, '参数异常： RN项目名称  ' + Object.keys(rnProjectPath));
        return false
    }
    if (!env[curEnv]) {
        console.log(TAG, '参数异常： app环境  ' + Object.keys(env));
        return false
    }

    return true
}

/**
 * 检查本地Android代码
 * @param callback
 */
function checkPullAndroid(curAndroidProjectPath, callback) {
    // callback && callback()
    // return

    var cmd_android_git_status = "e: && cd " + curAndroidProjectPath + " && git status"
    var cmd_android_git_pull = "e: && cd " + curAndroidProjectPath + "&& git pull"
    console.log(TAG, "Android check：" + cmd_android_git_status)
    if (!curAndroidProjectPath) return

    child_process.exec(cmd_android_git_status, function (error, stdout, stderr) {
        if (error) {
            console.log(TAG, 'error: ', error, stderr)
            return
        }
        if (stdout.indexOf('Changes not staged for commit') > -1) {  //本地有未提交
            console.log(TAG, '本地有未提交的代码，需手动提交');
            return
        }
        if (stdout.indexOf('use "git pull" to update your local branch') > -1) {  //远程有代码更新
            console.log(TAG, "Android pull：" + cmd_android_git_status)
            child_process.exec(cmd_android_git_pull, function (error, stdout, stderr) {
                if (error) {
                    console.log(TAG, 'error: ', error, stderr)
                    return
                }
                callback && callback()
            });
        } else {
            callback && callback()
        }
    });
}

/**
 * 检查本地RN代码
 * @param callback
 */
function checkPullRN(curRNProjectPath, callback) {
    // callback && callback()
    // return

    var cmd_RN_git_status = "e: && cd " + curRNProjectPath + " && git status"
    var cmd_RN_git_pull = "e: && cd " + curRNProjectPath + " && git pull"

    console.log(TAG, "RN check start...  " + cmd_RN_git_status)
    if (!curRNProjectPath) return

    child_process.exec(cmd_RN_git_status, function (error, stdout, stderr) {
        if (error) {
            console.log(TAG, 'error: ', error, stderr)
            return
        }
        if (stdout.indexOf('Changes not staged for commit') > -1) {  //本地有未提交
            console.log(TAG, '本地有未提交的代码，需手动提交');
            return
        }
        if (stdout.indexOf('use "git pull" to update your local branch') > -1) {  //远程有代码更新
            console.log(TAG, "RN pull：" + cmd_RN_git_pull)
            child_process.exec(cmd_RN_git_pull, function (error, stdout, stderr) {
                if (error) {
                    console.log(TAG, 'error: ', error, stderr)
                    return
                }
                callback && callback()
            });
        } else {
            callback && callback()
        }
    });
}

/**
 * 删除RN中的图片文件
 * @param curAndroidProjectPath   Android项目路径
 */
function removeImage(curAndroidProjectPath) {
    var resDir = curAndroidProjectPath + '/app/src/main/res';
    console.log(TAG, 'Android remove image start... ' + resDir);
    if (!curAndroidProjectPath) return

    fs.readdirSync(resDir).forEach(function (file) {
        if (file.indexOf('drawable') == 0) {
            var curPath = resDir + "/" + file;
            fs.readdirSync(curPath).forEach(function (image) {
                if (image.indexOf('app_images') == 0 || image.indexOf('node_modules') == 0) {
                    var imgPath = curPath + "/" + image
                    fs.unlinkSync(imgPath)
                }
            })
        }
    })
    console.log(TAG, 'Android remove image end...');
}

/**
 * RN打包
 * @param curAndroidProjectPath   Android项目路径
 * @param curRNProjectPath        RN项目路径
 * @param callback   回调  只有打包成功才会回调
 */
function rnPack(curAndroidProjectPath, curRNProjectPath, callback) {
    if (!curAndroidProjectPath) return

    //RN打包命令
    var rnPackCMD = 'react-native bundle --platform android --dev false --entry-file index.android.js '
        + '--bundle-output {0}/app/src/main/assets/index.android.bundle '
        + '--assets-dest {0}/app/src/main/res';
    rnPackCMD = rnPackCMD.format(curAndroidProjectPath);
    //RN打包命令
    var cmd_rn_pack = 'e: && cd ' + curRNProjectPath + ' && ' + rnPackCMD;
    console.log(TAG, 'RN pack start...  ' + cmd_rn_pack);

    child_process.exec(cmd_rn_pack, function (err, res, errRes) {
        if (err) {
            console.log(TAG, 'RN pack err: ', err, errRes);
            return
        }
        console.log(TAG, 'RN pack end...');

        callback && callback()
    });
}

/**
 * Android gradle打包
 * @param curAndroidProjectPath
 * @param curRNProject
 * @param curEnv
 * @param callback
 */
function gradleBuild(curAndroidProjectPath, curRNProject, curEnv, callback) {
    if (!curAndroidProjectPath || !curRNProject || !curEnv) {
        console.log(TAG, 'gradle build err... curAndroidProjectPath: ' + curAndroidProjectPath + '    curRNProject: ' + curRNProject + '    curEnv：' + curEnv)
        callback && callback()
        return
    }
    var gradlewAssemble = 'assemble' + curRNProject.firstUpperCase() + curEnv.firstUpperCase()
    var cmd_gradle_pack = 'e: && cd ' + curAndroidProjectPath + ' && gradlew ' + gradlewAssemble
    console.log(TAG, 'gradle build start... ' + cmd_gradle_pack)

    child_process.exec(cmd_gradle_pack, function (err, res, errRes) {
        if (err) {
            console.log(TAG, 'error：', err, errRes);
            callback && callback()
            return
        }
        if (res.indexOf('BUILD SUCCESSFUL')) {
            var apkOutPath = curAndroidProjectPath + "\\app\\build\\outputs\\apk"
            var apkName = "app-wisdom_appVersion-" + curRNProject + curEnv.firstUpperCase() + ".apk"
            console.log(TAG, 'gradle build success...   apkOutPath: ' + apkOutPath + '   apkName: ' + apkName);
        } else {
            console.log(TAG, 'gradle build fail... ', res);
        }
        callback && callback()
    })
}

/**
 * bundle commit
 * @param curAndroidProjectPath   Android项目路径
 */
function rnGitCommit(curAndroidProjectPath, curRNProject, callback) {
    var commitMsg = "【RN打包】 脚本打包push-" + curRNProject
    var cmd_git_commit = 'e: && cd ' + curAndroidProjectPath + ' && git add . && git commit -m "' + commitMsg + '" && git push';

    console.log(TAG, 'RN git commit start... ' + cmd_git_commit);
    child_process.exec(cmd_git_commit, function (err, res, errRes) {
        if (err) {
            console.log(TAG, 'error：', err, errRes);
            callback && callback()
            return
        }
        console.log(TAG, 'RN git commit end...');

        callback && callback()
    });
}

/**
 * bundle reset
 * @param curAndroidProjectPath
 */
function rnGitReset(curAndroidProjectPath, callback) {
    var cmd_git_reset = 'e: && cd ' + curAndroidProjectPath + ' && git reset --hard  && git status'

    console.log(TAG, 'RN git reset  ' + cmd_git_reset);
    child_process.exec(cmd_git_reset, function (err, res, errRes) {
        if (err) {
            console.log(TAG, 'error：', err, errRes);
            callback && callback()
            return
        }
        if (res.indexOf('nothing to commit') == -1) {  //校验本地reset
            console.log(TAG, 'RN git reset fail...');
            callback && callback()
            return
        }
        console.log(TAG, 'RN git reset end...');

        callback && callback()
    })
}



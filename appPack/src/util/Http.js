/**
 * Created by danxiang.feng on 2018/8/6.
 */
require('isomorphic-fetch');

/**网络请求*/
var http = {
    request: function (requestUrl, requestParams = {}) {
        return fetchRequest('POST', requestUrl, requestParams, requestHeader())
    },
    upload: function (requestUrl, formData = {}) {
        return fetchRequest('POST', requestUrl, formData, uploadHeader())
    },

    fetch: function (method, requestUrl, requestBody, headers) {
        return fetchRequest(method, requestUrl, requestBody, headers)
    }
}
module.exports = http

/***********************    方法实现           **************************/




function fetchRequest(method, requestUrl, requestBody, headers) {
    if (!requestUrl || requestUrl.length <= 0) {
        return Promise.reject('error requestUrl')
    }
    let resultPromise = new Promise((resolve, reject) => {

        let request = {
            method: method,
            url: requestUrl,
            body: JSON.stringify(requestBody),
            headers: headers,
            timeout: 5000,
        }
        console.log("request=====>", request)
        fetch(requestUrl, request).then(function (response) {
            //console.log("responseAll: ", response)
            if (response.ok) {
                return response
            } else {
                var error = new Error()
                error.code = response.status
                error.response = response
                throw error
            }
        }).then(function (response) {
            return response.json()
        }).then(function (response = {}) {
            console.log("response=====>", JSON.stringify(response))
            resolve && resolve(response)
        }).catch(function (err) {
            console.log("response Err=====>", JSON.stringify(err))
            reject && reject(err)
        });
    })
    return resultPromise
}

function requestHeader() {
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    return headers
}

function uploadHeader() {
    var headers = {
        'Content-Type': 'multipart/form-data',
    }
    return headers
}


/**************     脚本测试                   ***********************/


// main()

function main() {
    http.request("http://dev.proxy.zanfin.com/api/proxy",
        {
            "apiKey": "wisdom.loan.user.registerNoCode",
            "data": "{\"phoneNumber\":\"13453453453\",\"memberName\":\"阿达\",\"gender\":1,\"userAgent\":\"mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/66.0.3359.117 safari/537.36\",\"requestAddress\":\"http://dev.hz.zanfin.com/promotion/#/registernocode?qd=CSA666&runChannelCode=qd003&loanUid=tgr003\",\"channelCode\":\"CSA666\",\"runChannelCode\":\"qd003\",\"loanUid\":\"tgr003\"}",
            "session": {},
            "sign": "1d432a3c05fc02a6911774fed7b05ff7",
            "system": {
                "appType": "H5",
                "appVersion": "1.0.0",
                "bundleVersion": 0,
                "channel": "",
                "hardware": "cancro",
                "identifier": "com.wisdom.market.dev",
                "systemVersion": "6.0.1"
            }
        }
    )
}

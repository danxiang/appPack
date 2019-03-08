/**
 * Created by danxiang.feng on 2018/8/30.
 */

require('isomorphic-fetch');

var baseUrl = 'http://dev.manager.zanfin.com/front-pc-manager'

var cookies = ''

main()

function main() {
        login(() => {
            upload('C:\\Users\\10556\\Desktop\\pack\\appPack\\rnPackPath\\lender\\2019-01-11 14-34-54.zip', () => {

            })
        })
}

function login(callback) {
    var loginUrl = baseUrl + '/login'
    var loginInfo = {
        method: 'POST',
        url: loginUrl,
        body: 'userName=fengdanxiang&userPassword=123456',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: "include"
    }

    console.log('loginRequest:  ', loginInfo)
    fetch(loginUrl, loginInfo).then((response) => {
        console.log('response=====>     ',response)
        if (response.ok) {
            callback && callback()
        } else {
            console.log('login fail')
        }
    })
}

function upload(filePath, callback) {
    var uploadUrl = baseUrl + '/patch/upload'

    let file = {
        'uri': filePath,
        'type': "multipart/form-data",
    }
    let uploadInfo = {
        method: 'POST',
        url: uploadUrl,
        body: {'file': file},
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        credentials: "include"
    }

    console.log('uploadRequest:  ', uploadInfo)
    fetch(uploadUrl, uploadInfo).then((response) => {
        if (response.ok) {
            console.log("response:      " ,response)
            //return response
        } else {
            console.log('file upload fail')
        }
    })
    //     .then((response)=>{
    //     return response.json()
    // }).then((response = {})=>{
    //     console.log("response: " + JSON.stringify(response))
    // }).catch((err)=>{
    //     console.log("response err: ",err)
    // })

}
/**
 * Created by danxiang.feng on 2019/3/6.
 */

var http = require('../util/Http')
var md5 = require('../util/md5')

main()

function main() {
    for (let i = 0; i < 1; i++) {
        first()
    }

}

/**
 * 第一步注册
 */
function first() {
    console.log("first===========>start")
    let apiKey = 'wisdom.loan.user.registerNoCode'
    let data = {
        phoneNumber: getPhone(),
        memberName: getName(),
        gender: getGender(),
        userAgent: "mozilla/5.0 (windows nt 10.0; wow64) applewebkit/537.36 (khtml, like gecko) chrome/66.0.3359.117 safari/537.36",
        requestAddress: "http://dev.hz.zanfin.com/promotion/#/registernocode?qd=CSA666&runChannelCode=qd003&loanUid=tgr003",
        channelCode: "CSA666",
        runChannelCode: "qd003",
        loanUid: "tgr003"
    }
    request(apiKey, data).then((response) => {
        console.log("first===========>end")
        if (response.code == 'success' && response.data.userId) {
            second(response.data.userId)
        }

    }).catch((err) => {
        console.log("first===========>end")
    })
}

/**
 * 第二部完善信息
 * @param userId
 */
function second(userId) {
    console.log("second===========>start")
    let apiKey = 'wisdom.loan.userInfo.generalizeUpdateUserInfo'
    let data = {
        "loanUserCode": userId,
        "loanAdCodeSecond": "430200",
        "loanCityNameSecond": "株洲",
        "birthday": "1990-01-01",
        "titleReqList": [{
            "optionKey": ["loan_amount_20000-50000"],
            "titleKey": "loan_amount"
        }, {"optionKey": ["loan_time_limit_6"], "titleKey": "loan_time_limit"}, {
            "optionKey": ["local_census_register"],
            "titleKey": "family_register_type"
        }, {"optionKey": ["employees"], "titleKey": "job_type"}, {
            "optionKey": ["monthly_income_3000-6000"],
            "titleKey": "monthly_income"
        }, {"optionKey": ["clock_in"], "titleKey": "salary_type"}, {
            "optionKey": ["credit_card_yes"],
            "titleKey": "credit_card"
        }, {
            "optionKey": ["is_social_security_yes"],
            "titleKey": "is_social_security"
        }, {
            "optionKey": ["is_accumulation_fund_yes"],
            "titleKey": "is_accumulation_fund"
        }, {"optionKey": ["own_house_yes"], "titleKey": "own_house"}, {
            "optionKey": ["house_loan_yes"],
            "titleKey": "house_loan"
        }, {"optionKey": ["own_car_yes"], "titleKey": "own_car"}, {
            "optionKey": ["car_loan_yes"],
            "titleKey": "car_loan"
        }, {"optionKey": ["guarantee_slip_yes"], "titleKey": "guarantee_slip"}, {
            "optionKey": ["Weilidai_yes"],
            "titleKey": "Weilidai"
        }]
    }

    request(apiKey, data).then((response) => {
        console.log("second===========>end")
        if (response.code == 'success') {

        }

    }).catch((err) => {
        console.log("second===========>end")
    })
}


/**
 * 接口请求
 * @param apiKey
 * @param requestParams
 * @returns {*}
 */
function request(apiKey = "", requestParams = {}) {
    let baseParams = {
        apiKey: apiKey,
        data: JSON.stringify(requestParams),
        system: {
            "appType": "H5",
            "appVersion": "1.2.0",
            "bundleVersion": 0,
            "channel": "",
            "hardware": "cancro",
            "identifier": "com.wisdom.market.dev",
            "systemVersion": "6.0.1"
        },
        session: {
            'userId': null,
            'token': "",
        }
    }
    const requestUrl = "http://dev.proxy.zanfin.com/api/proxy"
    const salt = "*(&!*(Q#IUHAX89y19823h*&(YQ#($(*AGFsd"
    let sign = md5(baseParams.apiKey + baseParams.session.token + baseParams.data + salt)
    baseParams.sign = sign.toString().toUpperCase()
    return http.request(requestUrl, baseParams)
}

/**
 * 获取随机姓名
 */
function getName() {
    const nameStr = "琼文二期偶很大空间好的刷卡机懊悔的刷卡机有掉漆和肯德基华科技和哦网球拍子线程不怎么先成本卡良好的卡萨聚合贷款为群殴譬如我一人女明星围殴他业务的围绕以为五二如意纹人业福克斯九分裤"

    let firstName = nameStr[Math.floor(Math.random() * nameStr.length)]
    let secondName = nameStr[Math.floor(Math.random() * nameStr.length)]

    let name = firstName + secondName

    console.log("getName======>" + name)
    return name
}

/**
 * 获取随机性别
 * @returns {string}
 */
function getGender() {
    const genderArr = [0, 1]  //性别

    let index = Math.floor(Math.random() * 2)

    let gender = genderArr[index]

    console.log("getGender======>" + gender)
    return gender
}

/**
 * 获取随机手机号
 */
function getPhone() {

    let phone = '1' + Math.floor(Math.random() * 7 + 3)

    for (let i = 0; i < 9; i++) {
        phone += Math.floor(Math.random() * 10)
    }
    console.log('getPhone======>' + phone)
    return phone
}
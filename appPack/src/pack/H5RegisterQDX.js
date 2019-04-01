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

    //贷款金额
    let loan_amount_arr = ["loan_amount_1000-5000", "loan_amount_5000-10000", "loan_amount_10000-20000", "loan_amount_20000-50000", "loan_amount_50000-100000", "loan_amount_100000-200000", "loan_amount_200000+"]
    let loan_amount = loan_amount_arr[Math.floor(Math.random() * loan_amount_arr.length)]

    //贷款期限
    let loan_time_limit_arr = ["loan_time_limit_1m", "loan_time_limit_3", "loan_time_limit_6", "loan_time_limit_12", "loan_time_limit_24", "loan_time_limit_36"]
    let loan_time_limit = loan_time_limit_arr[Math.floor(Math.random() * loan_time_limit_arr.length)]

    //职业类型
    let job_type_arr = ["please", "employees", "civil_servant", "employer", "merchant", "soho"]
    let job_type = job_type_arr[Math.floor(Math.random() * job_type_arr.length)]

    //月收入
    let monthly_income_arr = ["monthly_income_<3000", "monthly_income_3000-6000", "monthly_income_6000-10000", "monthly_income_10000-20000", "monthly_income_20000+"]
    let monthly_income = monthly_income_arr[Math.floor(Math.random() * monthly_income_arr.length)]

    //工资发放形式
    let salary_type_arr = ["wages_choose", "clock_in", "transfer_accounts", "ready_money"]
    let salary_type = salary_type_arr[Math.floor(Math.random() * salary_type_arr.length)]

    //生日
    let birthday = (1970 + Math.floor(Math.random() * 25)) + "-01-01"

    //
    let city_arr = ["上海", "株洲", "北京", "长沙"]
    let city = city_arr[Math.floor(Math.random() * city_arr.length)]


    let data = {
        "loanUserCode": userId,
        "loanAdCodeSecond": null,
        "loanCityNameSecond": "上海",
        "birthday": birthday,
        "titleReqList": [
            {
                "optionKey": [loan_amount],
                "titleKey": "loan_amount"
            },
            {
                "optionKey": [loan_time_limit],
                "titleKey": "loan_time_limit"
            },
            {
                "optionKey": ["local_census_register"],
                "titleKey": "family_register_type"
            },
            {
                "optionKey": [job_type],
                "titleKey": "job_type"
            },
            {
                "optionKey": [monthly_income],
                "titleKey": "monthly_income"
            },
            {
                "optionKey": [salary_type],
                "titleKey": "salary_type"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "credit_card_yes" : "credit_card_no"],
                "titleKey": "credit_card"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "is_social_security_yes" : "is_social_security_no"],
                "titleKey": "is_social_security"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "is_accumulation_fund_yes" : "is_accumulation_fund_no"],
                "titleKey": "is_accumulation_fund"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "own_house_yes" : "own_house_no"],
                "titleKey": "own_house"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "house_loan_yes" : "house_loan_no"],
                "titleKey": "house_loan"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "own_car_yes" : "own_car_no"],
                "titleKey": "own_car"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "car_loan_yes" : "car_loan_no"],
                "titleKey": "car_loan"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "guarantee_slip_yes" : "guarantee_slip_no"],
                "titleKey": "guarantee_slip"
            },
            {
                "optionKey": [Math.floor(Math.random() * 2) == 0 ? "Weilidai_yes" : "Weilidai_no"],
                "titleKey": "Weilidai"
            }
        ]
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
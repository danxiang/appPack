require('./src/ext/StringExt');
require('./src/ext/DateExt');

// main()

function main() {
    // let startDate = new Date('2016-06-22')
    // let endDate = new Date('2019-03-19')
    //
    // let between = endDate.getTime() - startDate.getTime()
    //
    // between = Math.floor(between / (1000 * 60 * 60 * 24))
    //
    // console.log('main====>', between)
    //
    // method1()
    // array()

}

function method1() {
    let time = new Date()
    console.log('methods=====>', time.format("yyyy-MM-dd hh-mm-ss.S"), '\t0')
    let addNum = 0
    setInterval(() => {
        addNum += 1
        let second = time.getSeconds() + 1
        time.setSeconds(second)
        console.log('methods=====>', time.format("yyyy-MM-dd hh-mm-ss.S"), '\t' + addNum)
    }, 1000)
}

function array() {
    let arr = [2,4,5,6,7,8]

    console.log("======》", arr.slice(0,2))
}

/*
* 二进制中1的个数
* 输入一个整数，输出该数二进制表示中1的个数。其中负数用补码表示。
* 思路：最简单的思路，整数n每次进行无符号右移一位，同1做&运算，可以判断最后以为是否为1。
* 通常的剑指offer的思路，n&(n-1) 操作相当于把二进制表示中最右边的1变成0。所以只需要看看进行了多少次这样的操作即可。看看什么时候n为0.
*/
function find1(){

	let n = 981
	let count = 0
	while(n!=0){
		n = n & (n - 1)
		console.log("find1====>",n)
		count ++
	}
	console.log("find1====>",count)
}

find0()
/**
* 判断二进制中0的个数
*/
function find0(){

	let n = 100
	let count = 0
	console.log('find0====>', n)
	while(n != 0){
		if ((n & 1) != 1) {
			console.log('find0 a====>', n)
			count ++
		} else {
			console.log('find0 b====>', n)
		}
		n >>>= 1
	}

	console.log('find0====>', count)
}

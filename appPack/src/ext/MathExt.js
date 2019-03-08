

/**
 * JS float数据的加减乘除
 */

/**
 * 加法
 */
Number.prototype.add = function(arg){
    var r1, r2, m;
    try {r1 = this.toString().split(".")[1].length} catch (e) {r1 = 0}
    try {r2 = arg.toString().split(".")[1].length} catch (e) {r2 = 0}
    m = Math.pow(10, Math.max(r1, r2))
    return (this * m + arg * m) / m
}

/**
 * 减法
 */
Number.prototype.sub = function (arg) {
    var r1, r2, m, n;
    try {r1 = this.toString().split(".")[1].length} catch (e) {r1 = 0}
    try {r2 = arg.toString().split(".")[1].length} catch (e) {r2 = 0}
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return ((this * m - arg * m) / m).toFixed(n)
}

/**
 * 乘法
 */
Number.prototype.mul = function (arg) {
    var m = 0, r1 = this.toString(), r2 = arg.toString()
    try {m += r1.split(".")[1].length} catch (e) {}
    try {m += r2.split(".")[1].length} catch (e) {}
    return Number(r1.replace(".","")) * Number(r2.replace(".","")) / Math.pow(10, m)
}

/**
 * 除法
 */
Number.prototype.div = function (arg) {
    var t1 = 0, t2 = 0, r1, r2
    try {t1 = this.toString().split(".")[1].length} catch (e) {}
    try {t2 = arg.toString().split(".")[1].length} catch (e) {}
    with (Math){
        r1 = Number(this.toString().replace(".",""))
        r2 = Number(arg.toString().replace(".",""))
        return (r1/r2) * pow(10, t2-t1)
    }
}

/**
 * Array扩展
 * Created by aaron on 17/2/25.
 */

/**
 * 添加单个数据
 * @param item  数据
 * @param index 要添加的位置
 * @returns {Array}
 */
Array.prototype.add = function (item, index) {
    if(index == undefined){
        index = this.length;
    }
    this.splice(index, 0, item);
    return this;
};

/**
 * 删除指定的数组数据
 * @returns {Array}
 */
Array.prototype.removeAll = function (argArray) {
    var count = argArray.length;
    if(count>0){
        for(var index = 0; index < count; index++ ){
            var pos = this.indexOf(argArray[index]);
            if(pos>-1){
                this.splice(pos, 1);
            }
        }
    }
    return this;
};

/**
 * 删除单个数据
 *
 * remove(1)    删除第一天数据
 * remove('a1') 删除 a1
 *
 * 如果数组内是 Number 类型 此方法不适用
 *
 * @param arg   索引或数据
 * @returns {Array}
 */
Array.prototype.remove = function (arg) {
    if(typeof arg === 'number'){
        this.splice(arg, 1);
    }else{
        var pos = this.indexOf(arg);
        if(pos>-1){
            this.splice(pos, 1);
        }
    }
    return this;
};

/**
 * 追加数据
 * @param argArray
 * @returns {Array}
 */
Array.prototype.addAll = function (argArray) {
    if(!(argArray instanceof Array)){
        return this;
    }
    this.push.apply(this, argArray);
    return this;
};

/**
 * 数组中是否包含item
 * @param argArray
 * @returns {boolean}
 */
Array.prototype.contains = function (item) {
    for (let index = 0; index<this.length; index++) {
        if (this[index] === item) {
            return true;
        }
    }
    return false;
};
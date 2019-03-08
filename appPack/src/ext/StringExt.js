
/**
 *  格式化字符串
 *  var template1="我是{0}，今年{1}了";
 *  var template2="我是{name}，今年{age}了";
 *  var result1=template1.format("loogn",22);
 *  var result2=template2.format({name:"loogn",age:22});
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

//firstUpperCase
String.prototype.firstUpperCase = function () {
    return this.toString()[0].toUpperCase() + this.toString().slice(1);
}

//replaceAll
String.prototype.replaceAll = function (oldChar, newChar) {
    return this.replace(new RegExp(oldChar,'gm'), newChar);
}

//endWith
String.prototype.endWith=function(endStr) {
    var d = this.length - endStr.length
    return ( d >= 0 && this.lastIndexOf(endStr) == d )
 }

 //startWith
 String.prototype.startWith = function(compareStr){
    return this.indexOf(compareStr) == 0;
 }
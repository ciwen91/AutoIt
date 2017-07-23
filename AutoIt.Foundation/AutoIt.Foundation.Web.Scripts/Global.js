//定义的空值
var None = new Object();
//转换为指定类型
function Cast(obj) {
    return obj;
}
//转换为数组
function CastToAry(t) {
    if (t instanceof Array) {
        return t;
    }
    else {
        return [t];
    }
}
//获取对象类型
function GetType(obj) {
    return obj.constructor;
}
//判断一个对象是否为空
function IsEmpty(obj) {
    return obj === null || obj === "" || obj === None;
}
//将对象转为字符串格式
function ToValueStr(obj, quote) {
    if (quote === void 0) { quote = '"'; }
    if (typeof (obj) == "number" || typeof (obj) == "boolean") {
        return obj.toString();
    }
    else {
        return quote + obj.toString() + quote;
    }
}
//获取GUID
function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//获取固定位数GUID
function NewGuidStr(len) {
    if (len === void 0) { len = 32; }
    return NewGuid().replace(/-/g, '').substr(0, len);
}
//浅表复制
function LightClone(t) {
    if (t instanceof Array) {
        return t.concat();
    }
    else {
        throw new Error("\u672A\u5B9E\u73B0" + t + "\u7684LightClone!");
    }
}
//深表复制
function DeepClone(t) {
    if (typeof (t) == "object") {
        var F = function () { };
        F.prototype = t.constructor.prototype;
        var obj = new F();
        for (var key in t) {
            obj[key] = DeepClone(t[key]);
        }
        return obj;
    }
    else {
        return JSON.parse(JSON.stringify(t));
    }
}
//将对象转换为字典
function ToDict(obj) {
    var dic = new Dictionary();
    $.Enumerable.From(obj).ForEach(function (item) {
        dic.Set(item.Key, item.Value);
    });
    return dic;
}
//循环
var Loop = (function () {
    function Loop() {
    }
    //For循环(循环次数)
    Loop.For = function (count) {
        var group = [];
        for (var i = 0; i < count; i++) {
            group.push(i);
        }
        return $.Enumerable.From(group);
    };
    return Loop;
}());
//初始化对象(对象,初始化函数)
function InitObj(obj, initFunc) {
    initFunc(obj);
    return obj;
}
var enumerable = $.Enumerable;
//将可枚举对象转换为列表
enumerable.prototype.ToList = function () {
    var group = new List();
    this.ForEach(function (item) { return group.Set(item); });
    return group;
};
enumerable.prototype.OrderByCompareFunc = function (func) {
    var group = this.ToArray();
    for (var i = 0; i < group.length - 1; i++) {
        for (var j = i + 1; j < group.length; j++) {
            if (func(group[i], group[j]) > 0) {
                var temp = group[i];
                group[i] = group[j];
                group[j] = temp;
            }
        }
    }
    return $.Enumerable.From(group);
};
//同步获取Ajax数据
function getAjaxData(url) {
    var response = $.ajax({ url: url, async: false });
    //如果状态为200则返回输出的文本
    var result = response.status == 200 ? response.responseText : None;
    return result;
}
//Base64转字节
function Base64ToByte(str) {
    var binStr = Base64ToBin(str);
    var group = new List();
    for (var i = 0; i < binStr.length; i += 8) {
        var byteStr = binStr.substr(i, 8);
        var byte = parseInt(byteStr, 2);
        group.Set(byte);
    }
    return group;
}
//Base64转二进制
function Base64ToBin(str) {
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var bitString = "";
    var tail = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] != "=") {
            var decode = code.indexOf(str[i]).toString(2);
            bitString += (new Array(7 - decode.length)).join("0") + decode;
        }
        else {
            tail++;
        }
    }
    return bitString.substr(0, bitString.length - tail * 2);
}
//function InitControl<T>(obj: T, parent: Control = null, initFunc: Action<T> = null): T {
//    if (initFunc) {
//        initFunc(obj);
//    }
//    if (parent && (<any>parent).ChildGroup) {
//        (<any>parent).ChildGroup.push(obj); 
//    }
//    return obj;
//}
//function StaticInit(obj: any, func: Action<Void>) {
//    if (!StaticInit.prototype.Dic) {
//        StaticInit.prototype.Dic = new Dictionary<any, Void>();
//    }
//    var dic = Cast<Dictionary<any, Void>>(StaticInit.prototype.Dic);
//    var type = obj.GetType;
//    if (!dic.Contains(type)) {
//        func(None);
//    }
//}
//$.fn.ToHtml = function (): string {
//    return $(this)[0].outerHTML;
//} 

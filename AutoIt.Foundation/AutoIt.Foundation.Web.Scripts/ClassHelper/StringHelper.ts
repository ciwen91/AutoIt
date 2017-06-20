interface String{
    NextPoint(startPoint: LinePoint,count: number): LinePoint;
    PrePoint(startPoint: LinePoint,count: number): LinePoint;
    MatchNext(regex: string, index?: number);
    MatchPre(regex: string, index?: number);
    Repeat(count: number): string;
    Reverse(): string;

    PrePoint1(startPoint: LinePoint, count: number): LinePoint;
}

//获取下一个位置（开始位置,偏移数）
String.prototype.NextPoint = function (startPoint,count) {
    var x = startPoint.X;
    var y = startPoint.Y;

    //从开始位置向后偏移指定字符数(从当前字符开始计算)
    for (var i = startPoint.Index; i < startPoint.Index + count; i++) {
        //移到下一行
        if (this[i] == '\n') {
            x = 0;
            y += 1;

        }
        //忽略回车符
        else if (this[i] == '\r') {

        }
        //移到下一列
        else {
            x += 1;
        }
    }

    var endPoint = new LinePoint(startPoint.Index + count, x, y);

    return endPoint;
}

//获取上一个位置(开始位置,偏移数)
String.prototype.PrePoint = function (startPoint,count) {
    var x = startPoint.X;
    var y = startPoint.Y;

    //从开始位置向前偏移指定字符数(从上一个字符开始计算)
    for (var i = startPoint.Index - 1; i > startPoint.Index - 1 - count; i--) {
         //移到上一行
        if (this[i] == '\n') {
            //获取上一行的内容
            var val = this.MatchPre('[^\\n]+', i - 1);
            x = val.length;
            y -= 1;
        }
        //忽略回车符
        else if (this[i] == '\r') {

        }
        //移到上一列
        else {
            x -= 1;
        }
    }

    var endPoint = new LinePoint(startPoint.Index - count, x, y);

    return endPoint;
}

//获取下一个匹配(匹配正则,匹配开始位置)
String.prototype.MatchNext = function(regex, index) {
    index = index || 0;

    if (index >= this.length) {
        return null;
    }

    var val = this.substr(index);
    var match = new RegExp(regex, "gm").exec(val);
    var result = match ? match[0] : "";

    return result;
}

//获取上一个匹配(匹配正则,匹配开始位置)
String.prototype.MatchPre = function (regex, index) {
    index = index || 0;

    if (index < 0) {
        return null;
    }

    //反转内容
    var val = this.substr(0, index + 1).Reverse();
    var match = new RegExp(regex, "g").exec(val);
    var result = match ? match[0] : "";
    //反转结果
    result = result.Reverse();

    return result;
}

//构建重复字符串(重复次数)
String.prototype.Repeat=function(count) {
    var val = "";

    for (var i = 0; i < count; i++) {
        val += this;
    }

    return val;
}

//反转字符串
String.prototype.Reverse=function() {
    return this.split('').reverse().join('');
}
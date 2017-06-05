interface String{
    NextPoint(count: number, startPoint: LinePoint): LinePoint;
    PrePoint(count: number, startPoint: LinePoint): LinePoint;
    MatchNext(regex: string, index?: number);
    MatchPre(regex: string, index?: number);
    Repeat(count:number):string;
}

String.prototype.NextPoint=function(count, startPoint) {
    var x = startPoint.X;
    var y = startPoint.Y;

    for (var i = startPoint.Index; i < startPoint.Index + count; i++) {
        if (this[i] == '\n') {
            x = 0;
            y += 1;

        }
        else if (this[i] == '\r') {

        }
        else {
            x += 1;
        }
    }

    var endPoint = new LinePoint(startPoint.Index + count, x, y);

    return endPoint;
}

String.prototype.PrePoint=function(count, startPoint) {
    var x = startPoint.X;
    var y = startPoint.Y;

    for (var i = startPoint.Index; i > startPoint.Index - count; i--) {
        if (this[i] == '\n') {
            x = 0;
            y -= 1;
        }
        else if (this[i] == '\r') {

        }
        else {
            x -= 1;
        }
    }

    var endPoint = new LinePoint(startPoint.Index + count, x, y);

    return endPoint;
}

String.prototype.MatchNext = function(regex, index) {
    index = index || 0;

    if (index >= this.length) {
        return null;
    }

    var val = this.substr(index);
    var result = new RegExp(regex).exec(val)[0]; 

    return result;
}

String.prototype.MatchPre = function (regex, index) {
    index = index || 0;

    if (index < 0) {
        return null;
    }

    var val = this.substr(0, index + 1);
    var result = new RegExp(regex).exec(val)[0];

    return result;
}

String.prototype.Repeat=function(count) {
    var val = "";

    for (var i = 0; i < count; i++) {
        val += this;
    }

    return val;
}
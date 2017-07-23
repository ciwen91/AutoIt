//位置信息
var LinePoint = (function () {
    function LinePoint(index, x, y) {
        this.Index = index;
        this.X = x;
        this.Y = y;
    }
    //比较位置信息(在后面:1,在前面:-1,同一位置:0)
    LinePoint.prototype.Compare = function (linePoint) {
        //根据Y比较
        if (this.Y != linePoint.Y) {
            return this.Y > linePoint.Y ? 1 : -1;
        }
        else if (this.X != linePoint.X) {
            return this.X > linePoint.X ? 1 : -1;
        }
        else {
            return 0;
        }
    };
    //偏移指定位置(位置)
    LinePoint.prototype.Add = function (linePoint) {
        var index = this.Index + linePoint.Index;
        var line = this.Y + linePoint.Y;
        //没换行就偏移指定列,否则偏移到新的列
        var col = linePoint.Y == 0 ? this.X + linePoint.X : linePoint.X;
        return new LinePoint(index, col, line);
    };
    return LinePoint;
}());
LinePoint.Empty = new LinePoint(0, 0, 0);

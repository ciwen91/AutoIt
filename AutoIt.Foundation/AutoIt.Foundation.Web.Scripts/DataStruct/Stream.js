//Base64流
var Stream = (function () {
    function Stream(str) {
        //当前位置
        this.Position = 0;
        this.ByteGroup = Base64ToByte(str);
    }
    //读取一个字节
    Stream.prototype.ReadByte = function () {
        var byte = this.ByteGroup.Get(this.Position);
        this.Position += 1;
        return byte;
    };
    //是否可以往后读
    Stream.prototype.CanRead = function () {
        return this.Position < this.ByteGroup.Count();
    };
    return Stream;
}());

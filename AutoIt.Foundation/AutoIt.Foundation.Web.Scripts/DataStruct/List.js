//列表
var List = (function () {
    function List(group) {
        //数据
        this._Data = [];
        if (typeof group != "undefined") {
            this._Data = group;
        }
    }
    //获取元素个数
    List.prototype.Count = function () {
        return this._Data.length;
    };
    //获取元素索引
    List.prototype.Index = function (val) {
        return this._Data.indexOf(val);
    };
    //是否包含元素
    List.prototype.Contains = function (val) {
        return this.Index(val) >= 0;
    };
    //获取元素(索引:默认最后一个元素)
    List.prototype.Get = function (index) {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }
        return this._Data[index];
    };
    //插入元素(元素,索引:默认插入到最后)
    List.prototype.Set = function (val, index) {
        if (typeof (index) == "undefined") {
            index = this.Count();
        }
        this._Data.splice(index, 0, val);
        return this;
    };
    //插入元素集合(元素集合,索引:默认最后位置)
    List.prototype.SetRange = function (group, index) {
        var _this = this;
        //前面的元素后插入
        $.Enumerable.From(group.ToArray().reverse()).ForEach(function (item) {
            _this.Set(item, index);
        });
        return this;
    };
    //移除元素(索引:默认最后位置)
    List.prototype.Remove = function (index) {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }
        var group = this._Data.splice(index, 1);
        return group[0];
    };
    //移除元素(元素)
    List.prototype.RemoveItem = function (item) {
        var index = this.Index(item);
        if (index >= 0) {
            this.Remove(index);
        }
        return item;
    };
    //清空列表
    List.prototype.Clear = function () {
        this._Data = [];
        return this;
    };
    //转换为数组
    List.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    //转换为枚举
    List.prototype.ToEnumerble = function () {
        return $.Enumerable.From(this.ToArray());
    };
    return List;
}());

//字典类
var Dictionary = (function () {
    function Dictionary() {
        //数据
        this._Data = [];
    }
    //获取元素个数
    Dictionary.prototype.Count = function () {
        return this._Data.length;
    };
    //获取索引(键)
    Dictionary.prototype.Index = function (key) {
        var index = $.Enumerable.From(this._Data)
            .Select(function (item) { return item.Item1; })
            .IndexOf(key);
        return index;
    };
    //获取值(键,默认值)
    Dictionary.prototype.Get = function (key, dft) {
        var index = this.Index(key);
        if (index < 0) {
            //返回默认值或None
            if (dft) {
                this.Set(key, dft);
                return dft;
            }
            else {
                return None;
            }
        }
        else {
            return this._Data[index].Item2;
        }
    };
    //设置值(键,值)
    Dictionary.prototype.Set = function (key, val) {
        var index = this.Index(key);
        //插入值或更新值
        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        }
        else {
            this._Data[index].Item2 = val;
        }
        return this;
    };
    //删除项(键)
    Dictionary.prototype.Remove = function (key) {
        var index = this.Index(key);
        if (index >= 0) {
            this._Data.splice(index, 1);
        }
        return this;
    };
    //转换为数组
    Dictionary.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return Dictionary;
}());

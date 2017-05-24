var Dictionary = (function () {
    function Dictionary() {
        this._Data = [];
    }
    Dictionary.prototype.Count = function () {
        return this._Data.length;
    };
    Dictionary.prototype.Index = function (key) {
        var index = $.Enumerable.From(this._Data)
            .Select(function (item) { return item.Item1; })
            .IndexOf(key);
        return index;
    };
    Dictionary.prototype.Get = function (key) {
        var index = this.Index(key);
        return index >= 0 ? this._Data[index].Item2 : None;
    };
    Dictionary.prototype.Set = function (key, val) {
        var index = this.Index(key);
        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        }
        else {
            this._Data[index].Item2 = val;
        }
        return this;
    };
    Dictionary.prototype.Remove = function (key) {
        var index = this.Index(key);
        if (index >= 0) {
            this._Data.splice(index, 1);
        }
        return this;
    };
    Dictionary.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return Dictionary;
}());
//# sourceMappingURL=Dictionary.js.map
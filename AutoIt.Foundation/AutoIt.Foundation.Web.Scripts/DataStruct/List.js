var List = (function () {
    function List() {
        this._Data = [];
    }
    List.prototype.Count = function () {
        return this._Data.length;
    };
    List.prototype.Contains = function (val) {
        return $.Enumerable.From(this._Data)
            .Any(function (item) { return item == val; });
    };
    List.prototype.Get = function (index) {
        if (!index) {
            index = this.Count() - 1;
        }
        return this._Data[index];
    };
    List.prototype.Set = function (val, index) {
        if (!index) {
            index = this.Count();
        }
        this._Data[index] = val;
        return this;
    };
    List.prototype.Remove = function (index) {
        if (!index) {
            index = this.Count() - 1;
        }
        this._Data.splice(index, 0);
        return this;
    };
    List.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return List;
}());
//# sourceMappingURL=List.js.map
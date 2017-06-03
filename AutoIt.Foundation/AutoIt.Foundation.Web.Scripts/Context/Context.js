var Context = (function () {
    function Context() {
    }
    Context.Do = function (action, contextObj) {
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));
        try {
            action();
        }
        finally {
            this._DicGroup.Remove();
        }
    };
    Context.Current = function () {
        if (this._DicGroup.Count() == 0) {
            return Cast(None);
        }
        return this._DicGroup.Get(0);
    };
    return Context;
}());
Context._DicGroup = new List();
//# sourceMappingURL=Context.js.map
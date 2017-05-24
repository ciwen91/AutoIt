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
    return Context;
}());
Context._DicGroup = new List();
//# sourceMappingURL=Context.js.map
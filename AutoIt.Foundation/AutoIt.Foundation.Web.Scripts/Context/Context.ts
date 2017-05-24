class Context {
    private static _DicGroup: List<Dictionary<string, Object>> = new List<Dictionary<string, Object>>();

    static Do(action: Action, contextObj?: Object) {
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));

        try {
            action();
        } finally {
            this._DicGroup.Remove();
        }
    }
}

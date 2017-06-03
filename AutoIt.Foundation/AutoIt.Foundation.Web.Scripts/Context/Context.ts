///<reference path="../DataStruct/List.ts"/>
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

    static Current(): Dictionary<string, Object> {
        if (this._DicGroup.Count() == 0) {
            return Cast<Dictionary<string,Object>>(None);
        }

        return this._DicGroup.Get(0);
    }
}

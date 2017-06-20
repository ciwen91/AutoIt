///<reference path="../DataStruct/List.ts"/>
//上下文相关类型
class Context {
    //上下文队列
    private static _DicGroup: List<Dictionary<string, Object>> = new List<Dictionary<string, Object>>();

    //在上下文中执行方法(方法,上下文对象)
    static Do(action: Action, contextObj?: Object) {
        //放入上下文对象
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));

        //执行方法并确保会释放上下文对象
        try {
            action();
        } finally {
            this._DicGroup.Remove();
        }
    }

    //获取上下文对象
    static Current(): Dictionary<string, Object> {
        if (this._DicGroup.Count() == 0) {
            return <Dictionary<string,Object>>(None);
        }

        return this._DicGroup.Get(0);
    }
}

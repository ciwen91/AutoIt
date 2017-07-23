///<reference path="../DataStruct/List.ts"/>
//上下文相关类型
var Context = (function () {
    function Context() {
    }
    //在上下文中执行方法(方法,上下文对象)
    Context.Do = function (action, contextObj) {
        //放入上下文对象
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));
        //执行方法并确保会释放上下文对象
        try {
            action();
        }
        finally {
            this._DicGroup.Remove();
        }
    };
    //获取上下文对象
    Context.Current = function () {
        if (this._DicGroup.Count() == 0) {
            return (None);
        }
        return this._DicGroup.Get(0);
    };
    return Context;
}());
//上下文队列
Context._DicGroup = new List();

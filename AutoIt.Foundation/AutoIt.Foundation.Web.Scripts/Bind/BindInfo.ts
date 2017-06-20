//绑定信息
class BindInfo {
    //绑定目标
    Target: FuncOne<any, any>;
    //绑定源
    Source: Func<any>;

    constructor(target: FuncOne<any, any>, source: Func<any>) {
        this.Target = target;
        this.Source = source;
    }

    //将源数据更新到目标
    Update(): BindInfo {
        var val = this.Source();
        this.Target(val);

        return this;
    }
}

//绑定管理类
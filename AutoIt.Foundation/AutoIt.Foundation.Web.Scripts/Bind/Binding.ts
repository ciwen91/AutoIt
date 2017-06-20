class Binding {
    //绑定信息
    static Key:string="Binding";

    //将源绑定到目标
    static Bind(target: FuncOne<any, any>, source: Func<any>) {
        var group = Context.Current();
        var bindGroup = <List<BindInfo>>group.Get(this.Key, new List<BindInfo>());

        bindGroup.Set(new BindInfo(target, source));
    }

    //更新所有绑定信息
    static Update() {
        var group = <List<BindInfo>>Context.Current().Get(this.Key);

        if (group != None) {
            group.ToEnumerble()
                .ForEach(item => {
                    item.Update();
                });
        }
    }
}
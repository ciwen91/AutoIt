class BindInfo {
    Target: Func<any>;
    Source: Func<any>;

    constructor(target: Func<any>, source: Func<any>) {
        this.Target = target;
        this.Source = source;
    }

    Update(): BindInfo {
        var visitor = new MemberVisitor();

        var sourceVal = visitor.GetValue(this.Source);
        visitor.SetValue(this.Target, sourceVal);

       return this;
   }
}

class Binding {
    static Key:string="Binding";

    static Bind(target: Func<any>, source: Func<any>) {
        var group = Context.Current();

        if (group.Get(this.Key) == None) {
            group.Set(this.Key, new List<BindInfo>());
        }
        var bindGroup = Cast<List<BindInfo>>(group.Get(this.Key));
        bindGroup.Set(new BindInfo(target, source));
    } 

    static Update() {
        var group = <List<BindInfo>>Context.Current().Get(this.Key);

        if (group != None) {
            $.each(group.ToArray(),
                (index, item) => {
                    item.Update();
                });
        }
    }
}
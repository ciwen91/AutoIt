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
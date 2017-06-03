var BindInfo = (function () {
    function BindInfo(target, source) {
        this.Target = target;
        this.Source = source;
    }
    BindInfo.prototype.Update = function () {
        var visitor = new MemberVisitor();
        var sourceVal = visitor.GetValue(this.Source);
        visitor.SetValue(this.Target, sourceVal);
        return this;
    };
    return BindInfo;
}());
var Binding = (function () {
    function Binding() {
    }
    Binding.Bind = function (target, source) {
        var group = Context.Current();
        var key = "Binding";
        if (group.Get(key) == None) {
            group.Set(key, new List());
        }
        var bindGroup = Cast(group.Get(key));
        bindGroup.Set(new BindInfo(target, source));
    };
    return Binding;
}());
//# sourceMappingURL=BindInfo.js.map
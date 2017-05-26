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
//# sourceMappingURL=BindInfo.js.map
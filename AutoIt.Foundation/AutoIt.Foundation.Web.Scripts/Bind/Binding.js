var Binding = (function () {
    function Binding() {
    }
    //将源绑定到目标
    Binding.Bind = function (target, source) {
        var group = Context.Current();
        var bindGroup = group.Get(this.Key, new List());
        bindGroup.Set(new BindInfo(target, source));
    };
    //更新所有绑定信息
    Binding.Update = function () {
        var group = Context.Current().Get(this.Key);
        if (group != None) {
            group.ToEnumerble()
                .ForEach(function (item) {
                item.Update();
            });
        }
    };
    return Binding;
}());
//绑定信息
Binding.Key = "Binding";

//绑定信息
var BindInfo = (function () {
    function BindInfo(target, source) {
        this.Target = target;
        this.Source = source;
    }
    //将源数据更新到目标
    BindInfo.prototype.Update = function () {
        var val = this.Source();
        this.Target(val);
        return this;
    };
    return BindInfo;
}());
//绑定管理类 

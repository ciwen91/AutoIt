var Context = (function () {
    function Context() {
    }
    Context.a = function () {
        this.a();
        Context.a();
        return 1;
    };
    return Context;
}());
//# sourceMappingURL=Context.js.map
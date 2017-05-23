var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var EgtManager = (function () {
            function EgtManager() {
                this.CharSetGroup = new List();
                this.SymbolGroup = new List();
                this.GroupGroup = new List();
                this.ProduceGroup = new List();
                this.DFAStateGroup = new List();
                this.LALRStateGroup = new List();
            }
            EgtManager.CreateFromStr = function (str) {
            };
            return EgtManager;
        }());
        LangAnaly.EgtManager = EgtManager;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=EgtManager.js.map
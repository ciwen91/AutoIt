var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var GramerInfo = (function (_super) {
                __extends(GramerInfo, _super);
                function GramerInfo() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._ChildGroup = new List();
                    return _this;
                }
                GramerInfo.prototype.GetLevel = function () {
                    if (this.Produce == null) {
                        return -1;
                    }
                    else if (this._ChildGroup.Count() == 0) {
                        return 0;
                    }
                    else {
                        return $.Enumerable.From(this._ChildGroup.ToArray()).Max(function (item) { return item.GetLevel() + 1; });
                    }
                };
                return GramerInfo;
            }(CodeEdit.LangAnaly.Model.SymbolInfoBase));
            Model.GramerInfo = GramerInfo;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=GramerInfo.js.map
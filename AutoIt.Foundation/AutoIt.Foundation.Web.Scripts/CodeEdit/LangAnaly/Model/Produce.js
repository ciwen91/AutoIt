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
            //����ʽ
            var Produce = (function (_super) {
                __extends(Produce, _super);
                function Produce() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Produce.Compare = function (a, b, group) {
                    var isSmall = group.ToEnumerble().Any(function (item) { return item.NonTerminal == a && item.SymbolGroup.Contains(b); });
                    var isBig = group.ToEnumerble().Any(function (item) { return item.NonTerminal == b && item.SymbolGroup.Contains(a); });
                    var result = 0;
                    if (isSmall) {
                        result -= 1;
                    }
                    if (isBig) {
                        result += 1;
                    }
                    if (result == 0) {
                        var first = group.ToEnumerble()
                            .Select(function (item) { return item.NonTerminal; })
                            .FirstOrDefault(null, function (item) { return item == a || item == b; });
                        if (first == a) {
                            result = -1;
                        }
                        else if (first == b) {
                            result = 1;
                        }
                    }
                    return result;
                };
                return Produce;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.Produce = Produce;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

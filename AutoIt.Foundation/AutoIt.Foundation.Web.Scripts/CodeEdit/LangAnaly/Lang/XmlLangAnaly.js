var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var XmlLangAnaly = (function (_super) {
            __extends(XmlLangAnaly, _super);
            function XmlLangAnaly() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            XmlLangAnaly.prototype.IsGramerMeanEro = function (gramerInfo) {
                //标签名称
                var symbolName = gramerInfo.Symbol.Name;
                if (symbolName == "End Tag") {
                    //起始标签
                    var startGramer = this._GramerReader
                        .GetClosetGrammer(function (item) { return item.Symbol != null && item.Symbol.Name == "Start Tag"; });
                    var startTagName = this.GetTagName(startGramer.Value);
                    //结束标签与起始标签名称不一致,则语法无意义
                    var endTagName = this.GetTagName(gramerInfo.Value);
                    if (endTagName != startTagName) {
                        return false;
                    }
                }
                return _super.prototype.IsGramerMeanEro.call(this, gramerInfo);
            };
            //获取标签名称(文本)
            XmlLangAnaly.prototype.GetTagName = function (text) {
                var group = /\w+/g.exec(text);
                var tagName = group ? group[0] : "";
                return tagName;
            };
            return XmlLangAnaly;
        }(LangAnaly.LangAnalyBase));
        LangAnaly.XmlLangAnaly = XmlLangAnaly;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

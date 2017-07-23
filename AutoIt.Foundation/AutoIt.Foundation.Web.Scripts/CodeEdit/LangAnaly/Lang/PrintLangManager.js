var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Lang;
        (function (Lang) {
            ///<reference path="../LangAnalyBase.ts"/>
            var PrintLangManager = (function (_super) {
                __extends(PrintLangManager, _super);
                function PrintLangManager(egtStr) {
                    return _super.call(this, egtStr) || this;
                }
                PrintLangManager.prototype.TokenRead = function (tokenInfo) {
                    //if (this.PrintToken) {
                    //    console.log("%c" + tokenInfo.Value + "," + tokenInfo.Symbol.Name, "color:blue;");
                    //}
                };
                PrintLangManager.prototype.GramerRead = function (gramerInfo) {
                    //console.log("%c" + ' '.Repeat(gramerInfo.GetLevel() * 3) + gramerInfo.GetLevel() + ":" + gramerInfo.Symbol.Name +
                    //    "," + gramerInfo.Value + "$", "color:green;");
                };
                PrintLangManager.prototype.GramerAccept = function (gramerInfo) {
                    //console.log("%c" + gramerInfo.Symbol.Name + "," + gramerInfo.Value, "color:red;");
                };
                return PrintLangManager;
            }(CodeEdit.LangAnaly.LangAnalyBase));
            Lang.PrintLangManager = PrintLangManager;
        })(Lang = LangAnaly.Lang || (LangAnaly.Lang = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

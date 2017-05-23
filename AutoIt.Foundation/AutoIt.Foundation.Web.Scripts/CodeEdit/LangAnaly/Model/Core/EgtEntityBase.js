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
            var EgtEntityBase = (function () {
                function EgtEntityBase() {
                }
                return EgtEntityBase;
            }());
            var CharSet = (function (_super) {
                __extends(CharSet, _super);
                function CharSet() {
                    _super.apply(this, arguments);
                    this.Group = new List();
                }
                return CharSet;
            }(EgtEntityBase));
            var CharSetItem = (function () {
                function CharSetItem() {
                }
                return CharSetItem;
            }());
            var Group = (function () {
                function Group() {
                }
                return Group;
            }());
            var AdvanceMode;
            (function (AdvanceMode) {
                AdvanceMode[AdvanceMode["Token"] = 0] = "Token";
                AdvanceMode[AdvanceMode["Character"] = 1] = "Character";
            })(AdvanceMode || (AdvanceMode = {}));
            var EndingMode;
            (function (EndingMode) {
                EndingMode[EndingMode["Open"] = 0] = "Open";
                EndingMode[EndingMode["Close"] = 1] = "Close";
            })(EndingMode || (EndingMode = {}));
            var Symbol = (function (_super) {
                __extends(Symbol, _super);
                function Symbol() {
                    _super.apply(this, arguments);
                }
                return Symbol;
            }(EgtEntityBase));
            var SymbolType;
            (function (SymbolType) {
                SymbolType[SymbolType["Nonterminal"] = 0] = "Nonterminal";
                SymbolType[SymbolType["Terminal"] = 1] = "Terminal";
                SymbolType[SymbolType["Noise"] = 2] = "Noise";
                SymbolType[SymbolType["EndofFile"] = 3] = "EndofFile";
                SymbolType[SymbolType["GroupStart"] = 4] = "GroupStart";
                SymbolType[SymbolType["GroundEnd"] = 5] = "GroundEnd";
                SymbolType[SymbolType["Error"] = 7] = "Error";
            })(SymbolType || (SymbolType = {}));
            var Produce = (function (_super) {
                __extends(Produce, _super);
                function Produce() {
                    _super.apply(this, arguments);
                }
                return Produce;
            }(EgtEntityBase));
            var DFAState = (function (_super) {
                __extends(DFAState, _super);
                function DFAState() {
                    _super.apply(this, arguments);
                    this.EdgGroup = new List();
                }
                return DFAState;
            }(EgtEntityBase));
            var DFAEdge = (function () {
                function DFAEdge() {
                }
                return DFAEdge;
            }());
            var LALRState = (function (_super) {
                __extends(LALRState, _super);
                function LALRState() {
                    _super.apply(this, arguments);
                    this.ActionGroup = new List();
                }
                return LALRState;
            }(EgtEntityBase));
            var LALRAction = (function () {
                function LALRAction() {
                }
                return LALRAction;
            }());
            var ActionType;
            (function (ActionType) {
                ActionType[ActionType["Shift"] = 1] = "Shift";
                ActionType[ActionType["Reduce"] = 2] = "Reduce";
                ActionType[ActionType["Goto"] = 3] = "Goto";
                ActionType[ActionType["Accept"] = 4] = "Accept";
            })(ActionType || (ActionType = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=EgtEntityBase.js.map
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
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Group = new List();
                    return _this;
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
                    return _super !== null && _super.apply(this, arguments) || this;
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
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Produce;
            }(EgtEntityBase));
            var DFAState = (function (_super) {
                __extends(DFAState, _super);
                function DFAState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.EdgGroup = new List();
                    return _this;
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
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ActionGroup = new List();
                    return _this;
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
            var SymbolInfoBase = (function () {
                function SymbolInfoBase(symbol, value, line, col, index) {
                    this.Symbol = symbol;
                    this.Value = value;
                    this.Line = line;
                    this.Col = col;
                    this.Index = index;
                }
                return SymbolInfoBase;
            }());
            var TokenInfo = (function (_super) {
                __extends(TokenInfo, _super);
                function TokenInfo(state, symbol, value, index, line, col) {
                    var _this = _super.call(this, symbol, value, index, line, col) || this;
                    _this.State = state;
                    return _this;
                }
                return TokenInfo;
            }(SymbolInfoBase));
            var TokenInfoState;
            (function (TokenInfoState) {
                TokenInfoState[TokenInfoState["Accept"] = 0] = "Accept";
                TokenInfoState[TokenInfoState["Error"] = 1] = "Error";
                TokenInfoState[TokenInfoState["End"] = 2] = "End";
            })(TokenInfoState || (TokenInfoState = {}));
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
            }(SymbolInfoBase));
            var GramerInfoState;
            (function (GramerInfoState) {
                GramerInfoState[GramerInfoState["Shift"] = 0] = "Shift";
                GramerInfoState[GramerInfoState["Reduce"] = 1] = "Reduce";
                GramerInfoState[GramerInfoState["Accept"] = 2] = "Accept";
                GramerInfoState[GramerInfoState["Error"] = 3] = "Error";
            })(GramerInfoState || (GramerInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=EgtEntityBase.js.map
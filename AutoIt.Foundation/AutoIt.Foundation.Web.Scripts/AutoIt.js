var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BindInfo = (function () {
    function BindInfo(target, source) {
        this.Target = target;
        this.Source = source;
    }
    BindInfo.prototype.Update = function () {
        var visitor = new MemberVisitor();
        var sourceVal = visitor.GetValue(this.Source);
        visitor.SetValue(this.Target, sourceVal);
        return this;
    };
    return BindInfo;
}());
var Binding = (function () {
    function Binding() {
    }
    Binding.Bind = function (target, source) {
        var group = Context.Current();
        if (group.Get(this.Key) == None) {
            group.Set(this.Key, new List());
        }
        var bindGroup = Cast(group.Get(this.Key));
        bindGroup.Set(new BindInfo(target, source));
    };
    Binding.Update = function () {
        var group = Context.Current().Get(this.Key);
        if (group != None) {
            $.each(group.ToArray(), function (index, item) {
                item.Update();
            });
        }
    };
    return Binding;
}());
Binding.Key = "Binding";
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var EgtManager = (function () {
            function EgtManager() {
                this.PropDic = new Dictionary();
                this.CharSetGroup = new List();
                this.SymbolGroup = new List();
                this.GroupGroup = new List();
                this.ProduceGroup = new List();
                this.DFAStateGroup = new List();
                this.LALRStateGroup = new List();
                //#endregion
            }
            EgtManager.CreateFromStr = function (str) {
                var manager = new EgtManager();
                var stream = new Stream(str);
                Context.Do(function () {
                    manager.ReadInfo(stream);
                    while (stream.Position < str.length) {
                        manager.ReadRecord(stream);
                    }
                });
                Binding.Update();
                return manager;
            };
            EgtManager.prototype.ReadInfo = function (stream) {
                this.Info = this.ReadString(stream);
            };
            EgtManager.prototype.ReadRecord = function (stream) {
                var recordType = this.ReadNum(stream, 1);
                var entityNum = this.ReadNum(stream, 2);
                var dataType = this.ReadEntity(stream);
                entityNum -= 1;
                if (dataType == 112) {
                    this.ReadProp(stream);
                }
                else if (dataType == 116) {
                    this.ReadTableCount(stream);
                }
                else if (dataType == 99) {
                    this.ReadCharSet(stream);
                }
                else if (dataType == 83) {
                    this.ReadSymbol(stream);
                }
                else if (dataType == 103) {
                    this.ReadGroup(stream);
                }
                else if (dataType == 82) {
                    this.ReadProduce(stream, entityNum);
                }
                else if (dataType == 73) {
                    this.ReadInitState(stream);
                }
                else if (dataType == 68) {
                    this.ReadDFAState(stream, entityNum);
                }
                else if (dataType == 76) {
                    this.ReadLALRState(stream, entityNum);
                }
                else {
                    for (var i = 0; i < entityNum; i++) {
                        this.ReadEntity(stream);
                    }
                }
            };
            //#region Prop、TableCount
            EgtManager.prototype.ReadProp = function (stream) {
                var index = this.ReadEntity(stream);
                var name = this.ReadEntity(stream);
                var val = this.ReadEntity(stream);
                this.PropDic.Set(name, val);
            };
            EgtManager.prototype.ReadTableCount = function (stream) {
                var symbolCnt = this.ReadEntity(stream);
                var charSetCnt = this.ReadEntity(stream);
                var ruleCnt = this.ReadEntity(stream);
                var dfaCnt = this.ReadEntity(stream);
                var lalrCnt = this.ReadEntity(stream);
                var groupCnt = this.ReadEntity(stream);
            };
            //#endregion
            //#region CharSet、Symbol、Group、Produce
            EgtManager.prototype.ReadCharSet = function (stream) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var unicodePlane = this.ReadEntity(stream);
                var rangeCount = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                var charSet = new LangAnaly.Model.CharSet();
                charSet.ID = index;
                charSet.Group = Loop.For(rangeCount)
                    .Select(function (item) { return InitObj(new LangAnaly.Model.CharSetItem(), function (obj) {
                    obj.Start = _this.ReadEntity(stream),
                        obj.End = _this.ReadEntity(stream);
                }); })
                    .ToList();
                this.CharSetGroup.Set(charSet);
            };
            EgtManager.prototype.ReadSymbol = function (stream) {
                var index = this.ReadEntity(stream);
                var name = this.ReadEntity(stream);
                var symbolType = this.ReadEntity(stream);
                var symbol = new LangAnaly.Model.Symbol();
                symbol.ID = index;
                symbol.Name = name;
                symbol.Type = symbolType;
                this.SymbolGroup.Set(symbol);
            };
            EgtManager.prototype.ReadGroup = function (stream) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var name = this.ReadEntity(stream);
                var containerIndex = this.ReadEntity(stream);
                var startIndex = this.ReadEntity(stream);
                var endIndex = this.ReadEntity(stream);
                var advanceMode = this.ReadEntity(stream);
                var endingMode = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                var nestCount = this.ReadEntity(stream);
                var nestGroup = Loop.For(nestCount)
                    .Select(function (item) { return _this.ReadEntity(stream); })
                    .ToList();
                var group = new LangAnaly.Model.Group();
                group.ID = index;
                group.Name = name;
                group.Container = this.SymbolGroup[containerIndex];
                group.Start = this.SymbolGroup[startIndex];
                group.End = this.SymbolGroup[endIndex];
                group.AdvanceMode = advanceMode;
                group.EndingMode = endingMode,
                    group.NestGroup = Loop.For(nestCount)
                        .Select(function (item) { return _this.ReadEntity(stream); })
                        .Select(function (item) { return _this.SymbolGroup[item]; })
                        .ToList();
                this.GroupGroup.Set(group);
            };
            EgtManager.prototype.ReadProduce = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var nonIndex = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                entityNum -= 3;
                var produce = new LangAnaly.Model.Produce();
                produce.ID = index;
                produce.NonTerminal = this.SymbolGroup.Get(nonIndex);
                produce.SymbolGroup = Loop.For(entityNum)
                    .Select(function (item) { return _this.ReadEntity(stream); })
                    .Select(function (item) { return _this.SymbolGroup.Get(item); })
                    .ToList();
                this.ProduceGroup.Set(produce);
            };
            //#endregion
            //#region InitState、DFAState、LALRState
            EgtManager.prototype.ReadInitState = function (stream) {
                var dfaIndex = this.ReadEntity(stream);
                var lalrIndex = this.ReadEntity(stream);
            };
            EgtManager.prototype.ReadDFAState = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var isAcceptState = this.ReadEntity(stream);
                var acceptIndex = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                entityNum -= 4;
                var dfaState = new LangAnaly.Model.DFAState();
                dfaState.ID = index,
                    dfaState.AcceptSymbol = isAcceptState ? this.SymbolGroup.Get(acceptIndex) : null,
                    dfaState.EdgGroup = Loop.For(entityNum / 3)
                        .Select(function (item) {
                        var edge = new LangAnaly.Model.DFAEdge();
                        edge.CharSet = _this.CharSetGroup.Get(_this.ReadEntity(stream));
                        var dfaStateIndex = _this.ReadEntity(stream);
                        var reserve2 = _this.ReadEntity(stream);
                        Binding.Bind(function (val) { return edge.TargetState = val; }, function () { return _this.DFAStateGroup.Get(dfaStateIndex); });
                        return edge;
                    })
                        .ToList();
                this.DFAStateGroup.Set(dfaState);
            };
            EgtManager.prototype.ReadLALRState = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                entityNum -= 2;
                var lalrState = new LangAnaly.Model.LALRState();
                lalrState.ID = index;
                lalrState.ActionGroup = Loop.For(entityNum / 4)
                    .Select(function (item) {
                    var elm = new LangAnaly.Model.LALRAction();
                    var symbolIndex = _this.ReadEntity(stream);
                    elm.Symbol = _this.SymbolGroup.Get(symbolIndex);
                    elm.ActionType = _this.ReadEntity(stream);
                    var targetIndex = _this.ReadEntity(stream);
                    var reserve2 = _this.ReadEntity(stream);
                    if (elm.ActionType == LangAnaly.Model.ActionType.Shift || elm.ActionType == LangAnaly.Model.ActionType.Goto) {
                        Binding.Bind(function (val) { return elm.TargetState = val; }, function () { return _this.LALRStateGroup.Get(targetIndex); });
                    }
                    else if (elm.ActionType == LangAnaly.Model.ActionType.Reduce) {
                        elm.TargetRule = _this.ProduceGroup.Get(targetIndex);
                    }
                    return elm;
                })
                    .ToList();
                this.LALRStateGroup.Set(lalrState);
            };
            //#endregion
            //#region Base
            EgtManager.prototype.ReadEntity = function (stream) {
                var type = this.ReadNum(stream, 1);
                if (type == 69) {
                    return null;
                }
                else if (type == 98) {
                    return this.ReadNum(stream, 1);
                }
                else if (type == 66) {
                    return this.ReadNum(stream, 1) == 1;
                }
                else if (type == 73) {
                    return this.ReadNum(stream, 2);
                }
                else if (type == 83) {
                    return this.ReadString(stream);
                }
                else {
                    throw "Unkonw Type!";
                }
            };
            EgtManager.prototype.ReadString = function (stream) {
                var str = "";
                while (true) {
                    var num = this.ReadNum(stream, 2);
                    if (num > 0) {
                        str += String.fromCharCode(num);
                    }
                    else {
                        break;
                    }
                }
                return str;
            };
            EgtManager.prototype.ReadNum = function (stream, digits) {
                var num = 0;
                for (var i = 0; i < digits; i++) {
                    num += stream.ReadByte() << (i * 8);
                }
                return num;
            };
            return EgtManager;
        }());
        LangAnaly.EgtManager = EgtManager;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var GramerReader = (function () {
            function GramerReader(edgManager) {
                this._GrammerGroup = new List();
                this._EgtManager = edgManager;
                var topInfo = new Tuple(edgManager.LALRStateGroup.Get[0], null);
                this._GrammerGroup.Set(topInfo);
            }
            GramerReader.prototype.ReadGramer = function (tokenInfo) {
                var _this = this;
                var curState = this._GrammerGroup.Get().Item1;
                var action = curState.GetAction(tokenInfo.Symbol);
                if (action == null) {
                    return new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Error, tokenInfo);
                }
                else {
                    if (action.ActionType == LangAnaly.Model.ActionType.Shift) {
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Shift, tokenInfo);
                        this._GrammerGroup.Set(new Tuple(action.TargetState, gramerSymbol));
                        return gramerSymbol;
                    }
                    else if (action.ActionType == LangAnaly.Model.ActionType.Reduce) {
                        var produce = action.TargetRule;
                        var prodSymbolCount = produce.SymbolGroup.Count();
                        var group = Loop.For(prodSymbolCount)
                            .Select(function (item) { return _this._GrammerGroup.Remove(); })
                            .Reverse()
                            .ToList();
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Reduce, group.Count() > 0
                            ? group.Get(0).Item2.StartToken
                            : new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, null, null, tokenInfo.Index, tokenInfo.Line, tokenInfo.Col));
                        gramerSymbol.SetChildGroup($.Enumerable.From(group.ToArray()).Select(function (item) { return item.Item2; }).ToList());
                        gramerSymbol.Value = $.Enumerable.From(group.ToArray()).Select(function (item) { return item.Item2.Value; }).ToArray().join("");
                        gramerSymbol.Symbol = produce.NonTerminal;
                        gramerSymbol.Produce = produce;
                        this._GrammerGroup.Set(new Tuple(this._GrammerGroup.Get().Item1.GetAction(produce.NonTerminal).TargetState, gramerSymbol));
                        return gramerSymbol;
                    }
                    else if (action.ActionType == LangAnaly.Model.ActionType.Accept) {
                        var gramerInfo = this._GrammerGroup.Get().Item2;
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Accept, tokenInfo);
                        gramerSymbol.SetChildGroup(new List().Set(gramerInfo));
                        gramerSymbol.Value = gramerInfo.Value;
                        gramerSymbol.Data = gramerInfo.Data;
                        return gramerSymbol;
                    }
                    else {
                        throw "NotSupportedException";
                    }
                }
            };
            return GramerReader;
        }());
        LangAnaly.GramerReader = GramerReader;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var LangManagerBase = (function () {
            function LangManagerBase(egtStr) {
                this.ContentNameGroup = new List();
                this._EgtManager = LangAnaly.EgtManager.CreateFromStr(egtStr);
            }
            LangManagerBase.prototype.GetValue = function (val) {
                this.Analy(val);
                return this._ResultGramerInfo ? this._ResultGramerInfo.Data : None;
            };
            LangManagerBase.prototype.Analy = function (val) {
                this._ResultGramerInfo = null;
                var tokenReader = new LangAnaly.TokenReader(this._EgtManager, val);
                var gramerReader = new LangAnaly.GramerReader(this._EgtManager);
                while (true) {
                    var token = tokenReader.ReadToken();
                    this.TokenRead(token);
                    if (token.Symbol == null || token.Symbol.Type != LangAnaly.Model.SymbolType.Noise) {
                        while (true) {
                            var gramer = gramerReader.ReadGramer(token);
                            if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Reduce) {
                                var gramerVal = val.substr(gramer.Index, token.Index - gramer.Index);
                                if (this.ContentNameGroup.Contains(gramer.Symbol.Name)) {
                                    var preWhiteSpace = val.MatchPre("\\s+", gramer.Index - 1);
                                    if (preWhiteSpace != null) {
                                        gramerVal = preWhiteSpace + gramerVal;
                                        var newPoint = val.PrePoint(preWhiteSpace.Length, new LinePoint(gramer.Index, gramer.Col, gramer.Line));
                                        gramer.Index = newPoint.Index;
                                        gramer.Line = newPoint.Y;
                                        gramer.Col = newPoint.X;
                                    }
                                    gramer.Value = gramerVal;
                                }
                                else {
                                    gramerVal = gramerVal.trim();
                                    gramer.Value = gramerVal;
                                }
                                this.GramerRead(gramer);
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Accept) {
                                this._ResultGramerInfo = gramer;
                                this.GramerAccept(gramer);
                            }
                            if (gramer.GramerState != LangAnaly.Model.GramerInfoState.Reduce) {
                                break;
                            }
                        }
                    }
                    if (token.State == LangAnaly.Model.TokenInfoState.End) {
                        break;
                    }
                }
            };
            LangManagerBase.prototype.TokenRead = function (tokenInfo) {
            };
            LangManagerBase.prototype.GramerRead = function (gramerInfo) {
            };
            LangManagerBase.prototype.GramerAccept = function (gramerInfo) {
            };
            return LangManagerBase;
        }());
        LangAnaly.LangManagerBase = LangManagerBase;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Lang;
        (function (Lang) {
            var PrintLangManager = (function (_super) {
                __extends(PrintLangManager, _super);
                function PrintLangManager(egtStr) {
                    return _super.call(this, egtStr) || this;
                }
                PrintLangManager.prototype.TokenRead = function (tokenInfo) {
                    if (this.PrintToken) {
                        console.log("%c" + tokenInfo.Value + "," + tokenInfo.Symbol.Name, "color:blue;");
                    }
                };
                PrintLangManager.prototype.GramerRead = function (gramerInfo) {
                    console.log("%c" + ' '.Repeat(gramerInfo.GetLevel() * 3) + gramerInfo.GetLevel() + ":" + gramerInfo.Symbol.Name +
                        "," + gramerInfo.Value + "$", "color:green;");
                };
                PrintLangManager.prototype.GramerAccept = function (gramerInfo) {
                    console.log("%c" + gramerInfo.Symbol.Name + "," + gramerInfo.Value, "color:red;");
                };
                return PrintLangManager;
            }(LangAnaly.LangManagerBase));
            Lang.PrintLangManager = PrintLangManager;
        })(Lang = LangAnaly.Lang || (LangAnaly.Lang = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var ActionType;
            (function (ActionType) {
                ActionType[ActionType["Shift"] = 1] = "Shift";
                ActionType[ActionType["Reduce"] = 2] = "Reduce";
                ActionType[ActionType["Goto"] = 3] = "Goto";
                ActionType[ActionType["Accept"] = 4] = "Accept";
            })(ActionType = Model.ActionType || (Model.ActionType = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var AdvanceMode;
            (function (AdvanceMode) {
                AdvanceMode[AdvanceMode["Token"] = 0] = "Token";
                AdvanceMode[AdvanceMode["Character"] = 1] = "Character";
            })(AdvanceMode = Model.AdvanceMode || (Model.AdvanceMode = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
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
            Model.EgtEntityBase = EgtEntityBase;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
///<reference path="EgtEntityBase.ts"/>>
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var CharSet = (function (_super) {
                __extends(CharSet, _super);
                function CharSet() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.Group = new List();
                    return _this;
                }
                return CharSet;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.CharSet = CharSet;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var CharSetItem = (function () {
                function CharSetItem() {
                }
                return CharSetItem;
            }());
            Model.CharSetItem = CharSetItem;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var DFAEdge = (function () {
                function DFAEdge() {
                }
                return DFAEdge;
            }());
            Model.DFAEdge = DFAEdge;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var DFAState = (function (_super) {
                __extends(DFAState, _super);
                function DFAState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.EdgGroup = new List();
                    return _this;
                }
                return DFAState;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.DFAState = DFAState;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var EndingMode;
            (function (EndingMode) {
                EndingMode[EndingMode["Open"] = 0] = "Open";
                EndingMode[EndingMode["Close"] = 1] = "Close";
            })(EndingMode = Model.EndingMode || (Model.EndingMode = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
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
            Model.SymbolInfoBase = SymbolInfoBase;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
///<reference path="SymbolInfoBase.ts"/>>
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var GramerInfo = (function (_super) {
                __extends(GramerInfo, _super);
                function GramerInfo(gramerState, startToken) {
                    var _this = _super.call(this, startToken.Symbol, startToken.Value, startToken.Index, startToken.Line, startToken.Col) || this;
                    _this._ChildGroup = new List();
                    _this.GramerState = gramerState;
                    _this.StartToken = startToken;
                    _this.Data = startToken.Data;
                    return _this;
                }
                GramerInfo.prototype.SetChildGroup = function (childGroup) {
                    var _this = this;
                    this._ChildGroup = childGroup;
                    $.each(this._ChildGroup.ToArray(), function (i, item) { return item.Parent = _this; });
                };
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
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var GramerInfoState;
            (function (GramerInfoState) {
                GramerInfoState[GramerInfoState["Shift"] = 0] = "Shift";
                GramerInfoState[GramerInfoState["Reduce"] = 1] = "Reduce";
                GramerInfoState[GramerInfoState["Accept"] = 2] = "Accept";
                GramerInfoState[GramerInfoState["Error"] = 3] = "Error";
            })(GramerInfoState = Model.GramerInfoState || (Model.GramerInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var Group = (function (_super) {
                __extends(Group, _super);
                function Group() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Group;
            }(Model.EgtEntityBase));
            Model.Group = Group;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var LALRAction = (function () {
                function LALRAction() {
                }
                return LALRAction;
            }());
            Model.LALRAction = LALRAction;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var LALRState = (function (_super) {
                __extends(LALRState, _super);
                function LALRState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.ActionGroup = new List();
                    return _this;
                }
                LALRState.prototype.GetAction = function (symbol) {
                    var action = $.Enumerable.From(this.ActionGroup.ToArray()).FirstOrDefault(null, function (item) { return item.Symbol == symbol; });
                    return action;
                };
                return LALRState;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.LALRState = LALRState;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var Produce = (function (_super) {
                __extends(Produce, _super);
                function Produce() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Produce;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.Produce = Produce;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var Symbol = (function (_super) {
                __extends(Symbol, _super);
                function Symbol() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Symbol;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.Symbol = Symbol;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var SymbolType;
            (function (SymbolType) {
                SymbolType[SymbolType["Nonterminal"] = 0] = "Nonterminal";
                SymbolType[SymbolType["Terminal"] = 1] = "Terminal";
                SymbolType[SymbolType["Noise"] = 2] = "Noise";
                SymbolType[SymbolType["EndofFile"] = 3] = "EndofFile";
                SymbolType[SymbolType["GroupStart"] = 4] = "GroupStart";
                SymbolType[SymbolType["GroundEnd"] = 5] = "GroundEnd";
                SymbolType[SymbolType["Error"] = 7] = "Error";
            })(SymbolType = Model.SymbolType || (Model.SymbolType = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var TokenInfo = (function (_super) {
                __extends(TokenInfo, _super);
                function TokenInfo(state, symbol, value, index, line, col) {
                    var _this = _super.call(this, symbol, value, index, line, col) || this;
                    _this.State = state;
                    return _this;
                }
                return TokenInfo;
            }(CodeEdit.LangAnaly.Model.SymbolInfoBase));
            Model.TokenInfo = TokenInfo;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var TokenInfoState;
            (function (TokenInfoState) {
                TokenInfoState[TokenInfoState["Accept"] = 0] = "Accept";
                TokenInfoState[TokenInfoState["Error"] = 1] = "Error";
                TokenInfoState[TokenInfoState["End"] = 2] = "End";
            })(TokenInfoState = Model.TokenInfoState || (Model.TokenInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var TokenReader = (function () {
            function TokenReader(egt, str) {
                this._Index = 0;
                this._Line = 0;
                this._Col = 0;
                this._Egt = egt;
                this._Str = str;
            }
            TokenReader.prototype.ReadToken = function () {
                if (this._Index == this._Str.length) {
                    var endSymbol = $.Enumerable.From(this._Egt.SymbolGroup.ToArray())
                        .First(function (item) { return item.Type == LangAnaly.Model.SymbolType.EndofFile; });
                    return new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.End, endSymbol, null, this._Index, this._Line, this._Col);
                }
                var index = this._Index;
                var startIndex = index;
                var state = this._Egt.DFAStateGroup[0];
                var acceptSymbol = null;
                var accpetIndex = -1;
                while (true) {
                    var edge = null;
                    if (index <= this._Str.length - 1) {
                        var cha = this._Str[index];
                        edge = state.GetEdge(cha);
                    }
                    if (edge != null) {
                        state = edge.TargetState;
                        if (state.AcceptSymbol != null) {
                            acceptSymbol = state.AcceptSymbol;
                            accpetIndex = index;
                        }
                        index++;
                    }
                    else {
                        if (acceptSymbol != null) {
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, acceptSymbol, this._Str.substr(startIndex, accpetIndex - startIndex + 1), this._Index, this._Line, this._Col);
                            this.Consumn(token.Value);
                            return token;
                        }
                        else {
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Error, null, this._Str[startIndex].toString(), this._Index, this._Line, this._Col);
                            this.Consumn(token.Value);
                            return token;
                        }
                    }
                }
            };
            TokenReader.prototype.Consumn = function (val) {
                var linePoint = this._Str.NextPoint(val.length, new LinePoint(this._Index, this._Line, this._Col));
                this._Index = linePoint.Index;
                this._Line = linePoint.Y;
                this._Col = linePoint.X;
            };
            return TokenReader;
        }());
        LangAnaly.TokenReader = TokenReader;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
String.prototype.NextPoint = function (count, startPoint) {
    var x = startPoint.X;
    var y = startPoint.Y;
    for (var i = startPoint.Index; i < startPoint.Index + count; i++) {
        if (this[i] == '\n') {
            x = 0;
            y += 1;
        }
        else if (this[i] == '\r') {
        }
        else {
            x += 1;
        }
    }
    var endPoint = new LinePoint(startPoint.Index + count, x, y);
    return endPoint;
};
String.prototype.PrePoint = function (count, startPoint) {
    var x = startPoint.X;
    var y = startPoint.Y;
    for (var i = startPoint.Index; i > startPoint.Index - count; i--) {
        if (this[i] == '\n') {
            x = 0;
            y -= 1;
        }
        else if (this[i] == '\r') {
        }
        else {
            x -= 1;
        }
    }
    var endPoint = new LinePoint(startPoint.Index + count, x, y);
    return endPoint;
};
String.prototype.MatchNext = function (regex, index) {
    index = index || 0;
    if (index >= this.length) {
        return null;
    }
    var val = this.substr(index);
    var result = new RegExp(regex).exec(val)[0];
    return result;
};
String.prototype.MatchPre = function (regex, index) {
    index = index || 0;
    if (index < 0) {
        return null;
    }
    var val = this.substr(0, index + 1);
    var result = new RegExp(regex).exec(val)[0];
    return result;
};
String.prototype.Repeat = function (count) {
    var val = "";
    for (var i = 0; i < count; i++) {
        val += this;
    }
    return val;
};
var List = (function () {
    function List() {
        this._Data = [];
    }
    List.prototype.Count = function () {
        return this._Data.length;
    };
    List.prototype.Contains = function (val) {
        return $.Enumerable.From(this._Data)
            .Any(function (item) { return item == val; });
    };
    List.prototype.Get = function (index) {
        if (!index) {
            index = this.Count() - 1;
        }
        return this._Data[index];
    };
    List.prototype.Set = function (val, index) {
        if (!index) {
            index = this.Count();
        }
        this._Data[index] = val;
        return this;
    };
    List.prototype.Remove = function (index) {
        if (!index) {
            index = this.Count() - 1;
        }
        var group = this._Data.splice(index, 0);
        return group[0];
    };
    List.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return List;
}());
///<reference path="../DataStruct/List.ts"/>
var Context = (function () {
    function Context() {
    }
    Context.Do = function (action, contextObj) {
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));
        try {
            action();
        }
        finally {
            this._DicGroup.Remove();
        }
    };
    Context.Current = function () {
        if (this._DicGroup.Count() == 0) {
            return Cast(None);
        }
        return this._DicGroup.Get(0);
    };
    return Context;
}());
Context._DicGroup = new List();
var Dictionary = (function () {
    function Dictionary() {
        this._Data = [];
    }
    Dictionary.prototype.Count = function () {
        return this._Data.length;
    };
    Dictionary.prototype.Index = function (key) {
        var index = $.Enumerable.From(this._Data)
            .Select(function (item) { return item.Item1; })
            .IndexOf(key);
        return index;
    };
    Dictionary.prototype.Get = function (key) {
        var index = this.Index(key);
        return index >= 0 ? this._Data[index].Item2 : None;
    };
    Dictionary.prototype.Set = function (key, val) {
        var index = this.Index(key);
        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        }
        else {
            this._Data[index].Item2 = val;
        }
        return this;
    };
    Dictionary.prototype.Remove = function (key) {
        var index = this.Index(key);
        if (index >= 0) {
            this._Data.splice(index, 1);
        }
        return this;
    };
    Dictionary.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return Dictionary;
}());
var LinePoint = (function () {
    function LinePoint(index, x, y) {
        this.Index = index;
        this.X = x;
        "".length;
        this.Y = y;
    }
    return LinePoint;
}());
var Stream = (function () {
    function Stream(str) {
        this.Position = 0;
        this.Str = str;
    }
    Stream.prototype.ReadByte = function () {
        var byteStr = this.Str.substr(this.Position, 8);
        var byte = parseInt(byteStr, 2);
        this.Position += 8;
        return byte;
    };
    return Stream;
}());
var Tuple = (function () {
    function Tuple(item1, item2) {
        this.Item1 = item1;
        this.Item2 = item2;
    }
    return Tuple;
}());
var MemberVisitor = (function () {
    function MemberVisitor() {
    }
    MemberVisitor.prototype.GetValue = function (func) {
        return func();
    };
    MemberVisitor.prototype.SetValue = function (func, value) {
        func(value);
        return this;
    };
    return MemberVisitor;
}());
var None = new Object();
function Cast(obj) {
    return obj;
}
function CastToAry(t) {
    if (t instanceof Array) {
        return t;
    }
    else {
        return [t];
    }
}
function GetType(obj) {
    return obj.constructor;
}
function IsEmpty(obj) {
    return obj === null || obj === "" || obj === None;
}
function ToValueStr(obj, quote) {
    if (quote === void 0) { quote = '"'; }
    if (typeof (obj) == "number" || typeof (obj) == "boolean") {
        return obj.toString();
    }
    else {
        return quote + obj.toString() + quote;
    }
}
function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function NewGuidStr(len) {
    if (len === void 0) { len = 32; }
    return NewGuid().replace(/-/g, '').substr(0, len);
}
function LightClone(t) {
    if (t instanceof Array) {
        return t.concat();
    }
    else {
        throw new Error("\u672A\u5B9E\u73B0" + t + "\u7684LightClone!");
    }
}
function DeepClone(t) {
    if (typeof (t) == "object") {
        var F = function () { };
        F.prototype = t.constructor.prototype;
        var obj = new F();
        for (var key in t) {
            obj[key] = DeepClone(t[key]);
        }
        return obj;
    }
    else {
        return JSON.parse(JSON.stringify(t));
    }
}
function ToDict(obj) {
    var dic = new Dictionary();
    $.Enumerable.From(obj).ForEach(function (item) {
        dic.Set(item.Key, item.Value);
    });
    return dic;
}
var Loop = (function () {
    function Loop() {
    }
    Loop.For = function (count) {
        var group = [];
        for (var i = 0; i < count; i++) {
            group.push(i);
        }
        return $.Enumerable.From(group);
    };
    return Loop;
}());
function InitObj(obj, initFunc) {
    initFunc(obj);
    return obj;
}
var enumerable = $.Enumerable;
enumerable.prototype.ToList = function () {
    var group = new List();
    this.ForEach(function (item) { return group.Set(item); });
    return group;
};
//function InitControl<T>(obj: T, parent: Control = null, initFunc: Action<T> = null): T {
//    if (initFunc) {
//        initFunc(obj);
//    }
//    if (parent && (<any>parent).ChildGroup) {
//        (<any>parent).ChildGroup.push(obj); 
//    }
//    return obj;
//}
//function StaticInit(obj: any, func: Action<Void>) {
//    if (!StaticInit.prototype.Dic) {
//        StaticInit.prototype.Dic = new Dictionary<any, Void>();
//    }
//    var dic = Cast<Dictionary<any, Void>>(StaticInit.prototype.Dic);
//    var type = obj.GetType;
//    if (!dic.Contains(type)) {
//        func(None);
//    }
//}
//$.fn.ToHtml = function (): string {
//    return $(this)[0].outerHTML;
//} 
//# sourceMappingURL=AutoIt.js.map
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var LalrAction = CodeEdit.LangAnaly.Model.LALRAction;
        var ActionType = CodeEdit.LangAnaly.Model.ActionType;
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
                //Binding.Update
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
                produce.NonTerminal = this.SymbolGroup[nonIndex];
                produce.SymbolGroup = Loop.For(entityNum)
                    .Select(function (item) { return _this.ReadEntity(stream); })
                    .Select(function (item) { return _this.SymbolGroup[item]; })
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
                    dfaState.AcceptSymbol = isAcceptState ? this.SymbolGroup[acceptIndex] : null,
                    dfaState.EdgGroup = Loop.For(entityNum / 3)
                        .Select(function (item) {
                        var edge = new LangAnaly.Model.DFAEdge();
                        edge.CharSet = _this.CharSetGroup[_this.ReadEntity(stream)];
                        var dfaStateIndex = _this.ReadEntity(stream);
                        var reserve2 = _this.ReadEntity(stream);
                        //Binding.Bind(() => edge.TargetState, () => this.DFAStateGroup[dfaStateIndex]);//???
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
                    var elm = new LalrAction();
                    var symbolIndex = _this.ReadEntity(stream);
                    elm.Symbol = _this.SymbolGroup[symbolIndex];
                    elm.ActionType = _this.ReadEntity(stream);
                    var targetIndex = _this.ReadEntity(stream);
                    var reserve2 = _this.ReadEntity(stream);
                    if (elm.ActionType == ActionType.Shift || elm.ActionType == ActionType.Goto) {
                    }
                    else if (elm.ActionType == ActionType.Reduce) {
                        elm.TargetRule = _this.ProduceGroup[targetIndex];
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
                        str += num.toString(); //??? ToChar
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
//# sourceMappingURL=EgtManager.js.map
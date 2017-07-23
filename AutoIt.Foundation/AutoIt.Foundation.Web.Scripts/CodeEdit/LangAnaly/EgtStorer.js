var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        //存储Egt信息
        var EgtStorer = (function () {
            function EgtStorer() {
                //属性集合
                this.PropDic = new Dictionary();
                //字符集合
                this.CharSetGroup = new List();
                //符号集合
                this.SymbolGroup = new List();
                //分组集合
                this.GroupGroup = new List();
                //产生式集合
                this.ProduceGroup = new List();
                //DFA状态集合
                this.DFAStateGroup = new List();
                //LALR状态集合
                this.LALRStateGroup = new List();
                //#endregion
            }
            //创建存储器
            EgtStorer.CreateFromStr = function (str) {
                var storer = new EgtStorer();
                var stream = new Stream(str);
                Context.Do(function () {
                    //读取信息
                    storer.ReadInfo(stream);
                    //读取所有记录
                    while (stream.CanRead()) {
                        storer.ReadRecord(stream);
                    }
                    //更新绑定信息 
                    Binding.Update();
                });
                return storer;
            };
            //读取语法信息
            EgtStorer.prototype.ReadInfo = function (stream) {
                this.Info = this.ReadString(stream);
            };
            //读取记录信息
            EgtStorer.prototype.ReadRecord = function (stream) {
                //记录类型(暂时只有复杂类型)
                var recordType = this.ReadNum(stream, 1);
                //实体个数
                var entityNum = this.ReadNum(stream, 2);
                //记录类型(属性、符号等)
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
            //读取语法属性
            EgtStorer.prototype.ReadProp = function (stream) {
                //索引
                var index = this.ReadEntity(stream);
                //名称
                var name = this.ReadEntity(stream);
                //值
                var val = this.ReadEntity(stream);
                this.PropDic.Set(name, val);
            };
            //读取集合元素个数
            EgtStorer.prototype.ReadTableCount = function (stream) {
                var symbolCnt = this.ReadEntity(stream);
                var charSetCnt = this.ReadEntity(stream);
                var ruleCnt = this.ReadEntity(stream);
                var dfaCnt = this.ReadEntity(stream);
                var lalrCnt = this.ReadEntity(stream);
                var groupCnt = this.ReadEntity(stream);
            };
            //#endregion
            //#region CharSet、Symbol、Group、Produce
            //读取字符集
            EgtStorer.prototype.ReadCharSet = function (stream) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var unicodePlane = this.ReadEntity(stream);
                //字符项个数
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
            //读取符号集
            EgtStorer.prototype.ReadSymbol = function (stream) {
                var index = this.ReadEntity(stream);
                //名称
                var name = this.ReadEntity(stream);
                //类型
                var symbolType = this.ReadEntity(stream);
                var symbol = new LangAnaly.Model.Symbol();
                symbol.ID = index;
                symbol.Name = name;
                symbol.Type = symbolType;
                this.SymbolGroup.Set(symbol);
            };
            //读取分组
            EgtStorer.prototype.ReadGroup = function (stream) {
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
            //读取产生式
            EgtStorer.prototype.ReadProduce = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                //产生式头部索引
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
            //读取初始状态
            EgtStorer.prototype.ReadInitState = function (stream) {
                var dfaIndex = this.ReadEntity(stream);
                var lalrIndex = this.ReadEntity(stream);
            };
            //读取DFA集合
            EgtStorer.prototype.ReadDFAState = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                //是否为可接受状态
                var isAcceptState = this.ReadEntity(stream);
                //接受符号的索引
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
                        //边对应的状态
                        var dfaStateIndex = _this.ReadEntity(stream);
                        var reserve2 = _this.ReadEntity(stream);
                        Binding.Bind(function (val) { return edge.TargetState = val; }, function () { return _this.DFAStateGroup.Get(dfaStateIndex); });
                        return edge;
                    })
                        .ToList();
                this.DFAStateGroup.Set(dfaState);
            };
            //读取LALR集合
            EgtStorer.prototype.ReadLALRState = function (stream, entityNum) {
                var _this = this;
                var index = this.ReadEntity(stream);
                var reserve = this.ReadEntity(stream);
                entityNum -= 2;
                var lalrState = new LangAnaly.Model.LALRState();
                lalrState.ID = index;
                lalrState.ActionGroup = Loop.For(entityNum / 4)
                    .Select(function (item) {
                    var elm = new LangAnaly.Model.LALRAction();
                    //边上的符号索引
                    var symbolIndex = _this.ReadEntity(stream);
                    elm.Symbol = _this.SymbolGroup.Get(symbolIndex);
                    elm.ActionType = _this.ReadEntity(stream);
                    //边对应的状态或产生式
                    var targetIndex = _this.ReadEntity(stream);
                    var reserve2 = _this.ReadEntity(stream);
                    if (elm.ActionType == LangAnaly.Model.ActionType.Shift || elm.ActionType == LangAnaly.Model.ActionType.Goto) {
                        //移入时读取目标状态
                        Binding.Bind(function (val) { return elm.TargetState = val; }, function () { return _this.LALRStateGroup.Get(targetIndex); });
                    }
                    else if (elm.ActionType == LangAnaly.Model.ActionType.Reduce) {
                        //规约时读取目标产生式
                        elm.TargetRule = _this.ProduceGroup.Get(targetIndex);
                    }
                    return elm;
                })
                    .ToList();
                this.LALRStateGroup.Set(lalrState);
            };
            //#endregion
            //#region Base
            //读取实体
            EgtStorer.prototype.ReadEntity = function (stream) {
                var type = this.ReadNum(stream, 1);
                //Empty
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
            //读取字符串
            EgtStorer.prototype.ReadString = function (stream) {
                var str = "";
                while (true) {
                    //0为字符串结尾
                    var num = this.ReadNum(stream, 2);
                    if (num > 0) {
                        //将数字转换为字符
                        str += String.fromCharCode(num);
                    }
                    else {
                        break;
                    }
                }
                return str;
            };
            //读取整数
            EgtStorer.prototype.ReadNum = function (stream, digits) {
                var num = 0;
                for (var i = 0; i < digits; i++) {
                    num += stream.ReadByte() << (i * 8);
                }
                return num;
            };
            return EgtStorer;
        }());
        LangAnaly.EgtStorer = EgtStorer;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

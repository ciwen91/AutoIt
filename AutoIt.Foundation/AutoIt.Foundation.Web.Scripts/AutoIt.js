var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//绑定信息
var BindInfo = (function () {
    function BindInfo(target, source) {
        this.Target = target;
        this.Source = source;
    }
    //将源数据更新到目标
    BindInfo.prototype.Update = function () {
        var val = this.Source();
        this.Target(val);
        return this;
    };
    return BindInfo;
}());
//绑定管理类 
var Binding = (function () {
    function Binding() {
    }
    //将源绑定到目标
    Binding.Bind = function (target, source) {
        var group = Context.Current();
        var bindGroup = group.Get(this.Key, new List());
        bindGroup.Set(new BindInfo(target, source));
    };
    //更新所有绑定信息
    Binding.Update = function () {
        var group = Context.Current().Get(this.Key);
        if (group != None) {
            group.ToEnumerble()
                .ForEach(function (item) {
                item.Update();
            });
        }
    };
    return Binding;
}());
//绑定信息
Binding.Key = "Binding";
CodeMirror.defaults.EditorID = null;
//CodeMirror扩展类
var CodeMirrorExtend = (function () {
    //编辑器的全局键,语法元数据地址,内容元素名称列表
    function CodeMirrorExtend(editorID, egtUrl, contentNameGroup, blockStartNameGroup) {
        if (contentNameGroup === void 0) { contentNameGroup = new List(); }
        if (blockStartNameGroup === void 0) { blockStartNameGroup = new List(); }
        //分析过的文本
        this._AnalyedText = null;
        //样式函数
        this.StyleFunc = null;
        //记录编辑器ID
        this._EditorID = editorID;
        //创建分析器
        var analy = this.CreateLangAnaly(egtUrl);
        analy.ContentNameGroup = contentNameGroup;
        analy.BlockStartNameGroup = blockStartNameGroup;
        this._LangAnaly = analy;
    }
    //创建编辑器(Html元素,配置)
    CodeMirrorExtend.CreateEditor = function (elm, option) {
        //设置编辑器ID
        var editorID = Math.random();
        option.EditorID = editorID;
        //创建编辑器
        var editor = CodeMirror.fromTextArea(elm, option);
        window[editorID] = editor;
        return editor;
    };
    //根据Egt地址判断语法类型,并生成语法分析器(Egt地址,内容符号名称列表)
    CodeMirrorExtend.prototype.CreateLangAnaly = function (egtUrl) {
        //获取语法元数据
        var egt = getAjaxData(egtUrl);
        //xml语法
        if (egtUrl.indexOf("xml") >= 0) {
            var analy = new CodeEdit.LangAnaly.XmlLangAnaly(egt);
            return analy;
        }
        else {
            throw "无法从" + egtUrl + "推断出分析器的类型！";
        }
    };
    //高亮文本
    CodeMirrorExtend.prototype.HighLight = function (stream, state) {
        //获取当前位置.如果是第一列,则行加1
        if (stream.pos == 0) {
            state.Line += 1;
        }
        var line = state.Line;
        var col = stream.pos;
        //更新分析器(文本可能有变化)
        this.UpdateAnalyzer();
        //获取当前位置的语法
        var gramerAnalyInfo = this._LangAnaly.GetAnalyInfo(line, col);
        var gramerInfo = gramerAnalyInfo == null ? null : gramerAnalyInfo.GramerInfo;
        //消耗语法
        this.ConsumeAnalyInfo(stream, gramerInfo, line, col);
        //获取Style
        var style = this.GetStyle(gramerAnalyInfo);
        return style;
    };
    //更新分析器(如果文本变化重新分析)
    CodeMirrorExtend.prototype.UpdateAnalyzer = function () {
        var editor = Cast(window[this._EditorID]);
        var text = editor.getValue();
        //CodeMirror从首个非空白行开始处理
        text = text.replace(/^\n/mg, "");
        //文本变化则重新分析
        if (this._AnalyedText != text) {
            this._LangAnaly.Analy(text);
            this._AnalyedText = text;
            editor.Extend = this;
            var gramer = this._LangAnaly._GramerReader._GrammerGroup.Get().Item2;
            if (gramer != null) {
                console.clear();
                this.ShowGramerTree(gramer, 0);
            }
        }
    };
    CodeMirrorExtend.prototype.ShowGramerTree = function (gramer, index, deep) {
        var _this = this;
        if (deep === void 0) { deep = 0; }
        console.log("  ".Repeat(deep) +
            deep +
            "-" +
            index +
            ":" +
            gramer.Symbol.Name +
            "(" +
            gramer.Index +
            "," +
            gramer.Line +
            "," +
            gramer.Col
            + "|" +
            gramer.GramerState +
            "," +
            CodeEdit.LangAnaly.Model.GramerInfoState[gramer.GramerState] +
            ")");
        gramer.GetChildGroup().ToEnumerble().ForEach(function (item, i) {
            _this.ShowGramerTree(item, i, deep + 1);
        });
    };
    //消耗语法
    CodeMirrorExtend.prototype.ConsumeAnalyInfo = function (stream, gramerInfo, line, col) {
        //如果语法为空,则消耗当前字符
        if (gramerInfo == null) {
            stream.next();
        }
        else {
            var endPoint = gramerInfo.EndLinePoint();
            var tempCol = col;
            while (!stream.eol() && (line < endPoint.Y || tempCol <= endPoint.X)) {
                stream.next();
                tempCol++;
            }
        }
    };
    //获取样式
    CodeMirrorExtend.prototype.GetStyle = function (gramerAnalyInfo) {
        var gramerInfo = gramerAnalyInfo == null ? null : gramerAnalyInfo.GramerInfo;
        //如果语法为空,则样式为空
        if (gramerInfo == null) {
            return null;
        }
        //如果语法为错误,则样式为错误
        if (gramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.Error) {
            return "error";
        }
        //如果语法为自动完成且下一个语法不为错误,则样式为错误
        if (gramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.AutoComplete) {
            var nextPoint = gramerInfo.NextPoint(this._AnalyedText);
            var nextAnalyInfo = this._LangAnaly.GetAnalyInfo(nextPoint.Y, nextPoint.X);
            var isNextError = nextAnalyInfo != null &&
                nextAnalyInfo.GramerInfo != null &&
                nextAnalyInfo.GramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.Error;
            if (!isNextError) {
                return "error";
            }
        }
        //如果定义了样式函数,则为样式函数的结果
        if (this.StyleFunc != null) {
            return this.StyleFunc(gramerAnalyInfo);
        }
        else {
            return null;
        }
    };
    return CodeMirrorExtend;
}());
CodeMirror.defineMIME("text/xml", "xml");
//xml Mode
CodeMirror.defineMode("xml", function (editorConfig, config) {
    var editorID = editorConfig.EditorID;
    //创建扩展类型
    var extend = new CodeMirrorExtend(editorID, "data/xml.egt.base64", new List(["Text"]), new List(["<"]));
    //样式函数
    extend.StyleFunc = function (analyInfo) {
        var style = null;
        //获取语法和可能的父符号名称
        var gramerInfo = analyInfo.GramerInfo;
        var name = gramerInfo.Symbol.Name;
        var parentMayNameGroup = analyInfo.ParantMaySymbolGroup.ToEnumerble()
            .Select(function (item) { return item.Name; });
        //尖括号
        if (name == "<" || name == ">" || name == "</" || name == "/>") {
            style = "tag bracket";
        }
        else if (name == "Name") {
            //标签名(父节点为标签)
            if (parentMayNameGroup.Count() > 0 && parentMayNameGroup.ElementAt(0).indexOf("Tag") >= 0) {
                style = "tag";
            }
            else if (parentMayNameGroup.Count() > 0 && parentMayNameGroup.ElementAt(0).indexOf("Attribute") >= 0) {
                style = "attribute";
            }
        }
        else if (name == "Val") {
            style = "string";
        }
        else if (name == "Text") {
            style = "emstrong";
        }
        return style;
    };
    return {
        startState: function () {
            //起始位-1行
            return {
                Line: -1
            };
        },
        token: function (stream, state) {
            //调用扩展类的高亮方法
            return extend.HighLight(stream, state);
        }
    };
});
CodeMirror.defineOption("autoTag", true, function (cm, val, old) {
    var map = {};
    map["'>'"] = function (cm) {
        var extend = cm.Extend;
        var analy = extend._LangAnaly;
        var ranges = cm.listSelections();
        for (var i = 0; i < ranges.length; i++) {
            var range = ranges[i];
            setTimeout(function () {
                var gramerReader = analy._GramerReader;
                var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
                if (info.ParantMaySymbolGroup.Count() > 0 && info.ParantMaySymbolGroup.Get(0).Name == "Start Tag") {
                    var nameGramer = gramerReader
                        .GetClosetGrammer(function (item) { return item.Symbol.Name == "Name" &&
                        gramerReader.GetParentMaySymbolGroup(item)
                            .ToEnumerble()
                            .Any(function (sItem) { return sItem.Name.indexOf("Tag") >= 0; }); }, info.GramerInfo);
                    var tag = nameGramer.Value;
                    range.anchor.ch++;
                    cm.replaceRange(">\n\n</" + tag + ">", range.head, range.anchor, "+insert");
                    // debugger;
                    cm.indentLine(range.head.line + 1, "prev", true);
                    cm.indentLine(range.head.line + 1, "add", true);
                    cm.indentLine(range.head.line + 2, "prev", true);
                    cm.indentLine(range.head.line + 2, "subtract", true);
                    var newPos = CodeMirror.Pos(range.head.line + 1, cm.getLine(range.head.line + 1).length);
                    cm.setSelections([{ head: newPos, anchor: newPos }]);
                }
            }, 0);
        }
        return CodeMirror.Pass;
    };
    map["'\"'"] = function (cm) {
        var extend = cm.Extend;
        var analy = extend._LangAnaly;
        var range = cm.listSelections()[0];
        setTimeout(function () {
            var gramerReader = analy._GramerReader;
            var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
            console.log(info);
            if (info.ParantMaySymbolGroup.Count() > 0 &&
                info.ParantMaySymbolGroup.Get(0).Name == "Val" &&
                info.ParantMaySymbolGroup.ToEnumerble().Any(function (item) { return item.Name == "Attribute"; })) {
                cm.replaceRange('"', range.head, range.anchor);
                var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                cm.setSelections([{ head: newPos, anchor: newPos }]);
            }
        }, 0);
        return CodeMirror.Pass;
    };
    cm.addKeyMap(map);
});
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
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        //从标记流中读取语法信息
        var GramerReader = (function () {
            function GramerReader(egtStorer) {
                //语法堆栈(下一个状态,当前语法)
                this._GrammerGroup = new List();
                this._EgtStorer = egtStorer;
                var topInfo = new Tuple(egtStorer.LALRStateGroup.Get(0), null);
                this._GrammerGroup.Set(topInfo);
            }
            //读取语法(符号)
            GramerReader.prototype.ReadGramer = function (tokenInfo) {
                //当前状态
                var curState = this.GetCurState();
                //符号对应的动作
                var action = curState.GetAction(tokenInfo.Symbol);
                //没有对应的动作则返回语法错误
                if (action == null) {
                    var gramer = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Error, tokenInfo);
                    return gramer;
                }
                else {
                    //移入
                    if (action.ActionType == LangAnaly.Model.ActionType.Shift) {
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Shift, tokenInfo);
                        //将状态和语法符号移入堆栈
                        this._GrammerGroup
                            .Set(new Tuple(action.TargetState, gramerSymbol));
                        return gramerSymbol;
                    }
                    else if (action.ActionType == LangAnaly.Model.ActionType.Reduce) {
                        var produce = action.TargetRule;
                        var prodSymbolCount = produce.SymbolGroup.Count();
                        //将产生式的主体移出堆栈
                        var group = new List();
                        var i = 0;
                        while (i < prodSymbolCount) {
                            var info = this._GrammerGroup.Remove();
                            group.Set(info);
                            if (info.Item2.GramerState != LangAnaly.Model.GramerInfoState.Error) {
                                i++;
                            }
                        }
                        group = group.ToEnumerble().Reverse().ToList();
                        //语法首符号为子语法的首符号或空符号
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Reduce, group.Count() > 0
                            ? group.Get(0).Item2.StartToken
                            : LangAnaly.Model.TokenInfo.NullToken());
                        gramerSymbol.SetChildGroup($.Enumerable.From(group.ToArray()).Select(function (item) { return item.Item2; }).ToList());
                        //语法文本为子语法文本的结合
                        gramerSymbol.Value = $.Enumerable.From(group.ToArray())
                            .Select(function (item) { return item.Item2.Value; })
                            .ToArray()
                            .join("");
                        //语法符号为产生式头部
                        gramerSymbol.Symbol = produce.NonTerminal;
                        gramerSymbol.Produce = produce;
                        //下一个状态为当前状态匹配动作的目标状态
                        var targetState = this.GetCurState().GetAction(produce.NonTerminal).TargetState;
                        this._GrammerGroup
                            .Set(new Tuple(targetState, gramerSymbol));
                        return gramerSymbol;
                    }
                    else if (action.ActionType == LangAnaly.Model.ActionType.Goto) {
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Reduce, tokenInfo);
                        this._GrammerGroup
                            .Set(new Tuple(action.TargetState, gramerSymbol));
                        return gramerSymbol;
                    }
                    else if (action.ActionType == LangAnaly.Model.ActionType.Accept) {
                        //根语法
                        var gramerInfo = this._GrammerGroup.Get().Item2;
                        var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Accept, tokenInfo);
                        gramerSymbol.SetChildGroup(new List().Set(gramerInfo));
                        //接受语法的文本和值与根语法相同
                        gramerSymbol.Value = gramerInfo.Value;
                        gramerSymbol.Data = gramerInfo.Data;
                        return gramerSymbol;
                    }
                    else {
                        throw "NotSupportedException";
                    }
                }
            };
            //结束分析
            GramerReader.prototype.EndRead = function () {
                //对于没有父元素且不为错误,则计算可能的父符号
                this._GrammerGroup.ToEnumerble()
                    .Where(function (item) { return item.Item2 != null && item.Item2.Parent == null && item.Item2.GramerState != LangAnaly.Model.GramerInfoState.Error; })
                    .ForEach(function (gramerItem) {
                    gramerItem.Item2.MayParentSymbolGroup = gramerItem.Item1.GetMayParentSymbolGroup();
                });
            };
            //获取指定位置的语法信息(行,列,内容符号名称列表)
            GramerReader.prototype.GetGrammerInfo = function (line, col, contentNameGroup) {
                //初始列表为顶级语法列表
                var group = this._GrammerGroup.ToEnumerble()
                    .Where(function (item) { return item.Item2 != null; })
                    .Select(function (item) { return item.Item2; })
                    .ToList();
                while (group.Count() > 0) {
                    var item = group.Remove(0);
                    var itemChildGroup = item.GetChildGroup();
                    //寻找匹配的叶子节点(没有子节点或内容节点)
                    if ((itemChildGroup.Count() == 0 || item.GramerState == LangAnaly.Model.GramerInfoState.Error || contentNameGroup.Index(item.Symbol.Name) >= 0) &&
                        item.Value &&
                        item.Contains(line, col)) {
                        return item;
                    }
                    else if (itemChildGroup.Count() > 0) {
                        group.SetRange(itemChildGroup);
                    }
                }
                return null;
            };
            //获取所有可能的父符号(当前语法)
            GramerReader.prototype.GetParentMaySymbolGroup = function (gramer) {
                var parentMaySymbolGroup = new List();
                //如果有父语法,则为父语法的符号
                if (gramer.Parent != null && gramer.GramerState != LangAnaly.Model.GramerInfoState.Error) {
                    var parentGramer = gramer.Parent;
                    while (parentGramer != null) {
                        parentMaySymbolGroup.Set(parentGramer.Symbol);
                        parentGramer = parentGramer.Parent;
                    }
                }
                else if (gramer.MayParent != null) {
                    var parentGramer = gramer.MayParent;
                    while (parentGramer != null) {
                        parentMaySymbolGroup.Set(parentGramer.Symbol);
                        parentGramer = parentGramer.Parent;
                    }
                }
                else {
                    parentMaySymbolGroup = gramer.MayParentSymbolGroup;
                }
                return parentMaySymbolGroup;
            };
            //自动补全不完整的语法
            GramerReader.prototype.AutoComplete = function (onlyOption) {
                var _this = this;
                if (onlyOption === void 0) { onlyOption = false; }
                //当前语法
                var grammer = this._GrammerGroup.Get().Item2;
                //空的(最开始)、错误的、完整的、必须的不补全
                if (grammer == null ||
                    grammer.GramerState == LangAnaly.Model.GramerInfoState.Error ||
                    (onlyOption && (this.IsComplete(grammer) || !this.IsInOptionPro(grammer)))) {
                    return false;
                }
                var index = this.GetIndex(grammer);
                var startIndex = index;
                //从当前状态开始不断移入节点,直到可以规约(根据语法信息)
                while (true) {
                    index = this._GrammerGroup.Count() - 1;
                    var state = this._GrammerGroup.Get(index).Item1;
                    var actionGroup = state.ActionGroup.ToEnumerble();
                    if (actionGroup.Any(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Accept; }) || (index > startIndex && actionGroup.Any(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Reduce; }))) {
                        break;
                    }
                    //寻找第一个移入类的动作
                    var shift = null;
                    if (shift == null) {
                        var reduceActionGroup = actionGroup.Where(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Reduce &&
                            item.TargetRule.SymbolGroup.Count() > 0; }).ToList();
                        if (reduceActionGroup.Count() > 1) {
                            var tempIndex = index;
                            var produce = reduceActionGroup.Get(0).TargetRule;
                            var cnt = produce.SymbolGroup.Count();
                            while (cnt > 0) {
                                if (this._GrammerGroup.Get(tempIndex).Item2.GramerState != LangAnaly.Model.GramerInfoState.Error) {
                                    cnt--;
                                }
                                tempIndex--;
                            }
                            var curState = this._GrammerGroup.Get(tempIndex).Item1;
                            var targetState = curState.GetAction(produce.NonTerminal).TargetState;
                            while (true) {
                                var reduceGroup = targetState.ActionGroup.ToEnumerble().Where(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Reduce; })
                                    .ToList();
                                if (reduceGroup.Count() < 1) {
                                    break;
                                }
                                reduceActionGroup = reduceGroup;
                                var reduceRule = reduceActionGroup.Get(0).TargetRule;
                                var reduceSymbol = reduceActionGroup.Get(0).TargetRule.NonTerminal;
                                if (reduceRule.SymbolGroup.Count() > 0) {
                                    break;
                                }
                                targetState = targetState.GetAction(reduceSymbol).TargetState;
                            }
                        }
                        shift = reduceActionGroup.ToEnumerble().FirstOrDefault(null);
                    }
                    if (shift == null) {
                        shift = actionGroup.Where(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Goto; })
                            .OrderByCompareFunc(function (a, b) { return LangAnaly.Model.Produce
                            .Compare(a.Symbol, b.Symbol, _this._EgtStorer.ProduceGroup); })
                            .FirstOrDefault(null);
                    }
                    if (shift == null) {
                        shift = actionGroup.OrderBy(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Shift ? 1 : 0; })
                            .Last();
                    }
                    //构造移入符号并读入符号(坐标为-1是为了不干扰定位)
                    var tokenInfo = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, shift.Symbol, null, -1, -1, -1);
                    while (true) {
                        var grm = this.ReadGramer(tokenInfo);
                        if (tokenInfo.Symbol.Name == "EOF" || grm.GramerState != LangAnaly.Model.GramerInfoState.Reduce) {
                            break;
                        }
                    }
                    console.log(shift.Symbol);
                    index++;
                }
                //状态为自动补全
                grammer.GramerState = LangAnaly.Model.GramerInfoState.AutoComplete;
                return true;
            };
            //设置错误语法(语法)
            GramerReader.prototype.SetEroGramer = function (grammer) {
                var index = this._GrammerGroup.Count() - 1;
                var preACGrammer = null;
                var preACState = null;
                //找到最前的补全元素
                while (index > 0) {
                    var preGrammer = this._GrammerGroup.Get(index).Item2;
                    if (preGrammer.Index >= 0) {
                        break;
                    }
                    else {
                        preACGrammer = preGrammer;
                        preACState = this._GrammerGroup.Get(index).Item1;
                    }
                    index--;
                }
                //如果存在补全元素,且错误语法为补全元素的一部分,则设置可能的父元素
                if (preACGrammer != null && grammer.Value) {
                    var maySymbolGroup = this._EgtStorer.DFAStateGroup.Get(0)
                        .GetMayAcceptSymbolGroup(grammer.Value);
                    if (maySymbolGroup.Contains(preACGrammer.Symbol)) {
                        //如果补全元素有父元素则设置为可能的父元素
                        if (preACGrammer.Parent != null) {
                            grammer.MayParent = preACGrammer;
                        }
                        else {
                            //否则根据补全元素的LALR状态获取可能的父元素
                            var group = new List([preACGrammer.Symbol]);
                            group.SetRange(preACState.GetMayParentSymbolGroup());
                            grammer.MayParentSymbolGroup = group;
                        }
                    }
                }
                //将错误语法加到堆栈中
                this._GrammerGroup.Set(new Tuple(None, grammer));
                return this;
            };
            //语法是否完成
            GramerReader.prototype.IsComplete = function (grammer) {
                //如果语法有产生式则为已完成
                if (grammer.Produce != null) {
                    return true;
                }
                var index = this.GetIndex(grammer);
                var state = this._GrammerGroup.Get(index).Item1;
                //如果当前状态有Reduce动作,则为已完成(说明当前状态可以Reduce,错误是由后面的字符导致的)
                if (state.ActionGroup.ToEnumerble()
                    .Any(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Reduce; })) {
                    return true;
                }
                return false;
            };
            //是否式可选的语法
            GramerReader.prototype.IsInOptionPro = function (gramer) {
                var index = this.GetIndex(gramer);
                //从上一个状态开始,如果能找的Reduce动作则不是必须的(说明可以不经过当前状态而Reduce)
                while (index > 0) {
                    var info = this._GrammerGroup.Get(index - 1);
                    var preGramer = info.Item2;
                    if (preGramer != null && preGramer.GramerState != LangAnaly.Model.GramerInfoState.Error) {
                        var preState = info.Item1;
                        if (preState.ActionGroup.ToEnumerble()
                            .Any(function (item) { return item.ActionType == LangAnaly.Model.ActionType.Reduce; })) {
                            return true;
                        }
                    }
                    index--;
                }
                return false;
            };
            //获取最近的语法(过滤函数)
            GramerReader.prototype.GetClosetGrammer = function (whereFunc, gramer) {
                if (gramer === void 0) { gramer = null; }
                var group = this._GrammerGroup.ToEnumerble().Select(function (item) { return item.Item2; });
                if (gramer != null) {
                    if (gramer.Parent != null) {
                        group = gramer.Parent.GetChildGroup().ToEnumerble();
                    }
                    var index = group.IndexOf(gramer);
                    group = group.Where(function (item, i) { return i <= index; });
                }
                var result = group
                    .Where(function (item) { return item != null &&
                    item.GramerState != LangAnaly.Model.GramerInfoState.Error; })
                    .Reverse()
                    .FirstOrDefault(null, whereFunc);
                return result;
            };
            //撤销语法
            GramerReader.prototype.BackGrammer = function () {
                //将当前语法设置为错误
                var result = this._GrammerGroup.ToEnumerble()
                    .Where(function (item) { return item.Item2 != null; })
                    .Select(function (item) { return item.Item2; })
                    .Last(function (item) { return item.GramerState != LangAnaly.Model.GramerInfoState.Error; });
                result.GramerState = LangAnaly.Model.GramerInfoState.Error;
                var index = this._GrammerGroup.Count() - 2;
                //去除前面空值语法(是由当前撤销语法带来的)
                while (index > 0) {
                    var gramer = this._GrammerGroup.Get(index).Item2;
                    if (gramer != null && !gramer.Value) {
                        gramer.GramerState = LangAnaly.Model.GramerInfoState.Error;
                    }
                    else {
                        break;
                    }
                    index--;
                }
                return result;
            };
            //获取当前状态
            GramerReader.prototype.GetCurState = function () {
                return this._GrammerGroup.ToEnumerble()
                    .Last(function (item) { return item.Item2 == null || item.Item2.GramerState != LangAnaly.Model.GramerInfoState.Error; })
                    .Item1;
            };
            //获取语法在栈中的位置(语法)
            GramerReader.prototype.GetIndex = function (grammer) {
                var index = $.Enumerable.From(this._GrammerGroup.ToArray())
                    .Select(function (item) { return item.Item2; })
                    .IndexOf(grammer);
                return index;
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
        //语法分析基类
        var LangAnalyBase = (function () {
            function LangAnalyBase(egtStr) {
                //内容符号名称列表
                this.ContentNameGroup = new List();
                //块开始名称列表
                this.BlockStartNameGroup = new List();
                this._EgtStorer = LangAnaly.EgtStorer.CreateFromStr(egtStr);
            }
            //获取值(文本)
            LangAnalyBase.prototype.GetValue = function (val) {
                var acceptGramer = this.Analy(val);
                return acceptGramer ? acceptGramer.Data : None;
            };
            //分析(文本):
            LangAnalyBase.prototype.Analy = function (val) {
                //构造Reader
                this._TokenReader = new LangAnaly.TokenReader(this._EgtStorer, val);
                this._GramerReader = new LangAnaly.GramerReader(this._EgtStorer);
                while (true) {
                    //读取一个符号
                    var token = this._TokenReader.ReadToken();
                    this.TokenRead(token);
                    //不处理可忽略的符号
                    if (!token.IsNoise()) {
                        //消耗符号
                        while (true) {
                            //读取语法
                            var gramer = this._GramerReader.ReadGramer(token);
                            //如果是规约,重新计算文本
                            if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Reduce) {
                                //文本从语法的索引开始到后面符号的索引结束(空字符)
                                var gramerVal = gramer.Index >= 0 ? val.substr(gramer.Index, token.Index - gramer.Index) : "";
                                //如果是内容符号,则还要包括前面的空白
                                if (this.ContentNameGroup.Contains(gramer.Symbol.Name)) {
                                    //从语法或符号的开始索引之前查找 
                                    var index = gramer.Index >= 0 ? gramer.Index : token.Index;
                                    var preWhiteSpace = val.MatchPre("^\\s+", index - 1);
                                    //如果前面有空白,则重新定位
                                    if (preWhiteSpace != null) {
                                        gramerVal = preWhiteSpace + gramerVal;
                                        var newPoint = val.PrePoint(new LinePoint(token.Index, token.Col, token.Line), gramerVal.length);
                                        gramer.Index = newPoint.Index;
                                        gramer.Line = newPoint.Y;
                                        gramer.Col = newPoint.X;
                                        gramer.StartToken.Index = gramer.Index;
                                        gramer.StartToken.Col = gramer.Col;
                                        gramer.StartToken.Line = gramer.Line;
                                    }
                                    gramer.Value = gramerVal;
                                }
                                else {
                                    gramerVal = gramerVal.trim();
                                    gramer.Value = gramerVal;
                                }
                                //如果语义错误,则撤回语法并设置为错误
                                if (!this.IsGramerMeanEro(gramer)) {
                                    this._GramerReader.BackGrammer();
                                }
                                else {
                                    this.GramerRead(gramer);
                                }
                                //Reduce时继续处理当前Token
                                continue;
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Accept) {
                                this.GramerAccept(gramer);
                                //根语法为Accept语法的第一个子语法
                                var resultGrammer = gramer.GetChildGroup().Get(0);
                                this._GramerReader.EndRead();
                                return resultGrammer;
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Error) {
                                //如果是块开始元素,则撤销前面的语法(直至正确为止)
                                if (gramer.Symbol != null && (this.BlockStartNameGroup.Contains(gramer.Symbol.Name) || token.Symbol.Name == "EOF")) {
                                    if (this._GramerReader.AutoComplete()) {
                                        //继续消耗字符
                                        continue;
                                    }
                                }
                                //尝试补全语法
                                var isAutoComplete = this._GramerReader.AutoComplete(true);
                                if (isAutoComplete) {
                                    //继续消耗字符
                                    continue;
                                }
                                else {
                                    this._GramerReader.SetEroGramer(gramer);
                                }
                            }
                            break;
                        }
                    }
                    //遇到结束符号则停止分析
                    if (token.State == LangAnaly.Model.TokenInfoState.End) {
                        break;
                    }
                }
                this._GramerReader.EndRead();
                return null;
            };
            //获取指定位置的分析信息(行,列)     
            LangAnalyBase.prototype.GetAnalyInfo = function (line, col) {
                //如果位于语法树中,则返回语法信息和可能的父符号
                var grammer = this._GramerReader.GetGrammerInfo(line, col, this.ContentNameGroup);
                if (grammer != null) {
                    var parentMaySymbolGroup = this._GramerReader.GetParentMaySymbolGroup(grammer);
                    return new LangAnaly.Model.GramerAnalyInfo(grammer, parentMaySymbolGroup);
                }
                return null;
            };
            //语法
            LangAnalyBase.prototype.IsGramerMeanEro = function (gramerInfo) {
                return true;
            };
            //读到符号(符号)
            LangAnalyBase.prototype.TokenRead = function (tokenInfo) {
            };
            //读到语法(语法)
            LangAnalyBase.prototype.GramerRead = function (gramerInfo) {
            };
            //语法被接受
            LangAnalyBase.prototype.GramerAccept = function (gramerInfo) {
            };
            return LangAnalyBase;
        }());
        LangAnaly.LangAnalyBase = LangAnalyBase;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
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
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //LALR��������
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
            //�����ַ�ģʽ
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
            //Egt信息基础类
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
///<reference path="EgtEntityBase.ts"/>>
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //�ַ���(DFA��)
            var CharSet = (function (_super) {
                __extends(CharSet, _super);
                function CharSet() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //�ַ�����
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
            //�ַ�����
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
            //DFA��
            var DFAEdge = (function () {
                function DFAEdge() {
                }
                //�ַ��Ƿ��ڱ���
                DFAEdge.prototype.IsFit = function (cha) {
                    var code = cha.charCodeAt(0);
                    return $.Enumerable.From(this.CharSet.Group.ToArray()).Any(function (item) { return code >= item.Start && code <= item.End; });
                };
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
            //DFA״̬
            var DFAState = (function (_super) {
                __extends(DFAState, _super);
                function DFAState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //�߼���
                    _this.EdgGroup = new List();
                    return _this;
                }
                //��ȡƥ��ı�(�ַ�)
                DFAState.prototype.GetEdge = function (cha) {
                    var edge = $.Enumerable.From(this.EdgGroup.ToArray())
                        .FirstOrDefault(null, function (item) { return item.IsFit(cha); });
                    return edge;
                };
                //��ȡ���ܽ��ܵķ���(�ַ���,���ʹ���״̬)
                DFAState.prototype.GetMayAcceptSymbolGroup = function (str, visiteStateGroup) {
                    if (visiteStateGroup === void 0) { visiteStateGroup = new List(); }
                    var group = new List();
                    //������ʹ��򷵻�,������
                    if (visiteStateGroup.Contains(this)) {
                        return group;
                    }
                    else {
                        visiteStateGroup.Set(this);
                    }
                    //����ַ�������Ϊ0,����ƥ��
                    if (str.length > 0) {
                        var edge = this.GetEdge(str[0]);
                        //ƥ��ʧ��ֱ�ӷ���
                        if (edge == null) {
                            return group;
                        }
                        else {
                            return edge.TargetState.GetMayAcceptSymbolGroup(str.substr(1), visiteStateGroup);
                        }
                    }
                    else {
                        //��ǰ״̬�Ŀɽ��ܵķ���
                        if (this.AcceptSymbol != null) {
                            group.Set(this.AcceptSymbol);
                        }
                        //����״̬�Ŀɽ��ܵķ���
                        var nextGroup = this.EdgGroup.ToEnumerble()
                            .SelectMany(function (item) { return item.TargetState.GetMayAcceptSymbolGroup(str, visiteStateGroup).ToArray(); })
                            .ToList();
                        group.SetRange(nextGroup);
                        group = group.ToEnumerble().Distinct().ToList();
                        return group;
                    }
                };
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
            //Group����ģʽ
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
            //语法分析信息
            var GramerAnalyInfo = (function () {
                function GramerAnalyInfo(gramerInfo, parantMaySymbolGroup) {
                    this.GramerInfo = gramerInfo;
                    this.ParantMaySymbolGroup = parantMaySymbolGroup;
                }
                return GramerAnalyInfo;
            }());
            Model.GramerAnalyInfo = GramerAnalyInfo;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //������Ϣ����
            var SymbolInfoBase = (function () {
                function SymbolInfoBase(symbol, value, line, col, index) {
                    this.Symbol = symbol;
                    this.Value = value;
                    this.Line = line;
                    this.Col = col;
                    this.Index = index;
                }
                SymbolInfoBase.prototype.Contains = function (line, col) {
                    var startPoint = this.StartLintPoint();
                    var endPoint = this.EndLinePoint();
                    var curPoint = new LinePoint(-1, col, line);
                    return curPoint.Compare(startPoint) >= 0 && curPoint.Compare(endPoint) <= 0;
                };
                //��ʼλ��
                SymbolInfoBase.prototype.StartLintPoint = function () {
                    return new LinePoint(this.Index, this.Col, this.Line);
                };
                //����λ��
                SymbolInfoBase.prototype.EndLinePoint = function () {
                    var point = this.Value.NextPoint(LinePoint.Empty, this.Value.length - 1);
                    var endPoint = this.StartLintPoint().Add(point);
                    return endPoint;
                };
                return SymbolInfoBase;
            }());
            Model.SymbolInfoBase = SymbolInfoBase;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
///<reference path="SymbolInfoBase.ts"/>>
var CodeEdit;
///<reference path="SymbolInfoBase.ts"/>>
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //�﷨��Ϣ
            var GramerInfo = (function (_super) {
                __extends(GramerInfo, _super);
                function GramerInfo(gramerState, startToken) {
                    var _this = _super.call(this, startToken.Symbol, startToken.Value, startToken.Line, startToken.Col, startToken.Index) || this;
                    //����ʽ
                    _this.Produce = null;
                    //���﷨����
                    _this._ChildGroup = new List();
                    _this.MayParent = null;
                    _this.MayParentSymbolGroup = new List();
                    _this.GramerState = gramerState;
                    _this.StartToken = startToken;
                    _this.Data = startToken.Data;
                    return _this;
                }
                //��ȡ���﷨
                GramerInfo.prototype.GetChildGroup = function () {
                    return this._ChildGroup;
                };
                //�������﷨
                GramerInfo.prototype.SetChildGroup = function (childGroup) {
                    var _this = this;
                    this._ChildGroup = childGroup;
                    this._ChildGroup.ToEnumerble()
                        .ForEach(function (item) { return item.Parent = _this; });
                };
                //��ȡ�﷨�㼶
                GramerInfo.prototype.GetLevel = function () {
                    if (this.Produce == null) {
                        return -1;
                    }
                    else if (this._ChildGroup.Count() == 0) {
                        return 0;
                    }
                    else {
                        return this._ChildGroup.ToEnumerble().Max(function (item) { return item.GetLevel() + 1; });
                    }
                };
                //��һ��λ��(�ַ���)
                GramerInfo.prototype.NextPoint = function (val) {
                    var nextPoint = val.NextPoint(this.EndLinePoint(), 1);
                    return nextPoint;
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
            //�﷨״̬
            var GramerInfoState;
            (function (GramerInfoState) {
                //����
                GramerInfoState[GramerInfoState["Shift"] = 0] = "Shift";
                //��Լ
                GramerInfoState[GramerInfoState["Reduce"] = 1] = "Reduce";
                //����
                GramerInfoState[GramerInfoState["Accept"] = 2] = "Accept";
                //����
                GramerInfoState[GramerInfoState["Error"] = 3] = "Error";
                //(����)�Զ���ȫ
                GramerInfoState[GramerInfoState["AutoComplete"] = 4] = "AutoComplete";
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
            //����
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
            //LALR����
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
            //LALR״̬
            var LALRState = (function (_super) {
                __extends(LALRState, _super);
                function LALRState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //�����б�
                    _this.ActionGroup = new List();
                    _this._MayParentSymbolGroup = null;
                    return _this;
                }
                //��ȡ����(����)
                LALRState.prototype.GetAction = function (symbol) {
                    var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, function (item) { return item.Symbol == symbol; });
                    return action;
                };
                //��ȡ���ܵĸ�����
                LALRState.prototype.GetMayParentSymbolGroup = function () {
                    //��������,��ֱ�ӷ���
                    if (this._MayParentSymbolGroup != null) {
                        return this._MayParentSymbolGroup;
                    }
                    else {
                        var group = this.GetMayParentSymbolGroup$(1, new List());
                        group = group.ToEnumerble().Distinct().ToList();
                        this._MayParentSymbolGroup = group;
                        return group;
                    }
                };
                //��ȡ���ܵĸ�����
                LALRState.prototype.GetMayParentSymbolGroup$ = function (deep, visitedStateGroup) {
                    //������ʹ��򷵻�,�����Ƿ��ʹ�
                    if (visitedStateGroup.Contains(this)) {
                        return new List();
                    }
                    else {
                        visitedStateGroup.Set(this);
                    }
                    //�ҵ����е���ȴ��ڵ��ڵ�ǰ��ȵĹ�ԼԪ��
                    var curGroup = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item
                        .ActionType ==
                        Model.ActionType.Reduce &&
                        item.TargetRule.SymbolGroup.Count() >= deep; })
                        .Select(function (item) { return item.TargetRule.NonTerminal; })
                        .ToList();
                    //���������GoToԪ��,�ҵ����+1�ĸ�Ԫ��
                    var mayGroup = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Shift || item.ActionType == Model.ActionType.Goto; })
                        .SelectMany(function (item) { return item.TargetState.GetMayParentSymbolGroup$(deep + 1, visitedStateGroup).ToArray(); })
                        .ToList();
                    var resultGroup = curGroup.SetRange(mayGroup);
                    return resultGroup;
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
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //����
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
            //��������
            var SymbolType;
            (function (SymbolType) {
                //���ս��
                SymbolType[SymbolType["Nonterminal"] = 0] = "Nonterminal";
                //�ս��
                SymbolType[SymbolType["Terminal"] = 1] = "Terminal";
                //�ɺ��Եķ���
                SymbolType[SymbolType["Noise"] = 2] = "Noise";
                //�ı�ĩβ
                SymbolType[SymbolType["EndofFile"] = 3] = "EndofFile";
                //���鿪ʼ
                SymbolType[SymbolType["GroupStart"] = 4] = "GroupStart";
                //����ĩβ
                SymbolType[SymbolType["GroundEnd"] = 5] = "GroundEnd";
                //����
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
            //�Ǻ�
            var TokenInfo = (function (_super) {
                __extends(TokenInfo, _super);
                function TokenInfo(state, symbol, value, index, line, col) {
                    var _this = _super.call(this, symbol, value, line, col, index) || this;
                    _this.State = state;
                    return _this;
                }
                TokenInfo.NullToken = function () {
                    return new Model.TokenInfo(Model.TokenInfoState.Accept, null, null, -1, -1, -1);
                };
                TokenInfo.prototype.IsNoise = function () {
                    return this.Symbol != null && this.Symbol.Type == Model.SymbolType.Noise;
                };
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
                //����
                TokenInfoState[TokenInfoState["Accept"] = 0] = "Accept";
                //����
                TokenInfoState[TokenInfoState["Error"] = 1] = "Error";
                //����
                TokenInfoState[TokenInfoState["End"] = 2] = "End";
            })(TokenInfoState = Model.TokenInfoState || (Model.TokenInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        //从字符串中读取记号
        var TokenReader = (function () {
            function TokenReader(egt, str) {
                //当前索引
                this._Index = 0;
                //当前行
                this._Line = 0;
                //当前列
                this._Col = 0;
                this._Egt = egt;
                this._Str = str;
            }
            //读取记号
            TokenReader.prototype.ReadToken = function () {
                //如果已读到字符串末尾就返回EndOfFile记号
                if (this._Index == this._Str.length) {
                    var endSymbol = this._Egt.SymbolGroup.ToEnumerble()
                        .First(function (item) { return item.Type == LangAnaly.Model.SymbolType.EndofFile; });
                    return new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.End, endSymbol, null, this._Index, this._Line, this._Col);
                }
                var index = this._Index;
                var startIndex = index;
                //开始状态
                var state = this._Egt.DFAStateGroup.Get(0);
                //接受记号
                var acceptSymbol = null;
                //接受索引
                var accpetIndex = -1;
                while (true) {
                    var edge = null;
                    //
                    if (index <= this._Str.length - 1) {
                        var cha = this._Str[index];
                        edge = state.GetEdge(cha);
                    }
                    //如果边不为空
                    if (edge != null) {
                        //切换到目标状态
                        state = edge.TargetState;
                        //记录可接受的标记
                        if (state.AcceptSymbol != null) {
                            acceptSymbol = state.AcceptSymbol;
                            accpetIndex = index;
                        }
                        index++;
                    }
                    else {
                        //如果有接受标记,则返回接受标记
                        if (acceptSymbol != null) {
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, acceptSymbol, this._Str.substr(startIndex, accpetIndex - startIndex + 1), this._Index, this._Line, this._Col);
                            //消耗标记文本
                            this.Consumn(token.Value);
                            return token;
                        }
                        else {
                            //如果没有接受标记,则返回错误标记
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Error, null, this._Str[startIndex].toString(), this._Index, this._Line, this._Col);
                            //消耗当前字符
                            this.Consumn(token.Value);
                            return token;
                        }
                    }
                }
            };
            //消耗文本
            TokenReader.prototype.Consumn = function (val) {
                var linePoint = this._Str.NextPoint(new LinePoint(this._Index, this._Col, this._Line), val.length);
                this._Index = linePoint.Index;
                this._Line = linePoint.Y;
                this._Col = linePoint.X;
            };
            return TokenReader;
        }());
        LangAnaly.TokenReader = TokenReader;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//获取下一个位置（开始位置,偏移数）
String.prototype.NextPoint = function (startPoint, count) {
    var x = startPoint.X;
    var y = startPoint.Y;
    //从开始位置向后偏移指定字符数(从当前字符开始计算)
    for (var i = startPoint.Index; i < startPoint.Index + count; i++) {
        //移到下一行
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
//获取上一个位置(开始位置,偏移数)
String.prototype.PrePoint = function (startPoint, count) {
    var x = startPoint.X;
    var y = startPoint.Y;
    //从开始位置向前偏移指定字符数(从上一个字符开始计算)
    for (var i = startPoint.Index - 1; i > startPoint.Index - 1 - count; i--) {
        //移到上一行
        if (this[i] == '\n') {
            //获取上一行的内容
            var val = this.MatchPre('[^\\n]+', i - 1);
            x = val.length;
            y -= 1;
        }
        else if (this[i] == '\r') {
        }
        else {
            x -= 1;
        }
    }
    var endPoint = new LinePoint(startPoint.Index - count, x, y);
    return endPoint;
};
//获取下一个匹配(匹配正则,匹配开始位置)
String.prototype.MatchNext = function (regex, index) {
    index = index || 0;
    if (index >= this.length) {
        return null;
    }
    var val = this.substr(index);
    var match = new RegExp(regex, "gm").exec(val);
    var result = match ? match[0] : "";
    return result;
};
//获取上一个匹配(匹配正则,匹配开始位置)
String.prototype.MatchPre = function (regex, index) {
    index = index || 0;
    if (index < 0) {
        return null;
    }
    //反转内容
    var val = this.substr(0, index + 1).Reverse();
    var match = new RegExp(regex, "g").exec(val);
    var result = match ? match[0] : "";
    //反转结果
    result = result.Reverse();
    return result;
};
//构建重复字符串(重复次数)
String.prototype.Repeat = function (count) {
    var val = "";
    for (var i = 0; i < count; i++) {
        val += this;
    }
    return val;
};
//反转字符串
String.prototype.Reverse = function () {
    return this.split('').reverse().join('');
};
//列表
var List = (function () {
    function List(group) {
        //数据
        this._Data = [];
        if (typeof group != "undefined") {
            this._Data = group;
        }
    }
    //获取元素个数
    List.prototype.Count = function () {
        return this._Data.length;
    };
    //获取元素索引
    List.prototype.Index = function (val) {
        return this._Data.indexOf(val);
    };
    //是否包含元素
    List.prototype.Contains = function (val) {
        return this.Index(val) >= 0;
    };
    //获取元素(索引:默认最后一个元素)
    List.prototype.Get = function (index) {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }
        return this._Data[index];
    };
    //插入元素(元素,索引:默认插入到最后)
    List.prototype.Set = function (val, index) {
        if (typeof (index) == "undefined") {
            index = this.Count();
        }
        this._Data.splice(index, 0, val);
        return this;
    };
    //插入元素集合(元素集合,索引:默认最后位置)
    List.prototype.SetRange = function (group, index) {
        var _this = this;
        //前面的元素后插入
        $.Enumerable.From(group.ToArray().reverse()).ForEach(function (item) {
            _this.Set(item, index);
        });
        return this;
    };
    //移除元素(索引:默认最后位置)
    List.prototype.Remove = function (index) {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }
        var group = this._Data.splice(index, 1);
        return group[0];
    };
    //移除元素(元素)
    List.prototype.RemoveItem = function (item) {
        var index = this.Index(item);
        if (index >= 0) {
            this.Remove(index);
        }
        return item;
    };
    //清空列表
    List.prototype.Clear = function () {
        this._Data = [];
        return this;
    };
    //转换为数组
    List.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    //转换为枚举
    List.prototype.ToEnumerble = function () {
        return $.Enumerable.From(this.ToArray());
    };
    return List;
}());
///<reference path="../DataStruct/List.ts"/>
//上下文相关类型
var Context = (function () {
    function Context() {
    }
    //在上下文中执行方法(方法,上下文对象)
    Context.Do = function (action, contextObj) {
        //放入上下文对象
        if (!contextObj) {
            contextObj = {};
        }
        this._DicGroup.Set(ToDict(contextObj));
        //执行方法并确保会释放上下文对象
        try {
            action();
        }
        finally {
            this._DicGroup.Remove();
        }
    };
    //获取上下文对象
    Context.Current = function () {
        if (this._DicGroup.Count() == 0) {
            return (None);
        }
        return this._DicGroup.Get(0);
    };
    return Context;
}());
//上下文队列
Context._DicGroup = new List();
//字典类
var Dictionary = (function () {
    function Dictionary() {
        //数据
        this._Data = [];
    }
    //获取元素个数
    Dictionary.prototype.Count = function () {
        return this._Data.length;
    };
    //获取索引(键)
    Dictionary.prototype.Index = function (key) {
        var index = $.Enumerable.From(this._Data)
            .Select(function (item) { return item.Item1; })
            .IndexOf(key);
        return index;
    };
    //获取值(键,默认值)
    Dictionary.prototype.Get = function (key, dft) {
        var index = this.Index(key);
        if (index < 0) {
            //返回默认值或None
            if (dft) {
                this.Set(key, dft);
                return dft;
            }
            else {
                return None;
            }
        }
        else {
            return this._Data[index].Item2;
        }
    };
    //设置值(键,值)
    Dictionary.prototype.Set = function (key, val) {
        var index = this.Index(key);
        //插入值或更新值
        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        }
        else {
            this._Data[index].Item2 = val;
        }
        return this;
    };
    //删除项(键)
    Dictionary.prototype.Remove = function (key) {
        var index = this.Index(key);
        if (index >= 0) {
            this._Data.splice(index, 1);
        }
        return this;
    };
    //转换为数组
    Dictionary.prototype.ToArray = function () {
        return this._Data.concat([]);
    };
    return Dictionary;
}());
//位置信息
var LinePoint = (function () {
    function LinePoint(index, x, y) {
        this.Index = index;
        this.X = x;
        this.Y = y;
    }
    //比较位置信息(在后面:1,在前面:-1,同一位置:0)
    LinePoint.prototype.Compare = function (linePoint) {
        //根据Y比较
        if (this.Y != linePoint.Y) {
            return this.Y > linePoint.Y ? 1 : -1;
        }
        else if (this.X != linePoint.X) {
            return this.X > linePoint.X ? 1 : -1;
        }
        else {
            return 0;
        }
    };
    //偏移指定位置(位置)
    LinePoint.prototype.Add = function (linePoint) {
        var index = this.Index + linePoint.Index;
        var line = this.Y + linePoint.Y;
        //没换行就偏移指定列,否则偏移到新的列
        var col = linePoint.Y == 0 ? this.X + linePoint.X : linePoint.X;
        return new LinePoint(index, col, line);
    };
    return LinePoint;
}());
LinePoint.Empty = new LinePoint(0, 0, 0);
//Base64流
var Stream = (function () {
    function Stream(str) {
        //当前位置
        this.Position = 0;
        this.ByteGroup = Base64ToByte(str);
    }
    //读取一个字节
    Stream.prototype.ReadByte = function () {
        var byte = this.ByteGroup.Get(this.Position);
        this.Position += 1;
        return byte;
    };
    //是否可以往后读
    Stream.prototype.CanRead = function () {
        return this.Position < this.ByteGroup.Count();
    };
    return Stream;
}());
//元组
var Tuple = (function () {
    function Tuple(item1, item2) {
        this.Item1 = item1;
        this.Item2 = item2;
    }
    return Tuple;
}());
//定义的空值
var None = new Object();
//转换为指定类型
function Cast(obj) {
    return obj;
}
//转换为数组
function CastToAry(t) {
    if (t instanceof Array) {
        return t;
    }
    else {
        return [t];
    }
}
//获取对象类型
function GetType(obj) {
    return obj.constructor;
}
//判断一个对象是否为空
function IsEmpty(obj) {
    return obj === null || obj === "" || obj === None;
}
//将对象转为字符串格式
function ToValueStr(obj, quote) {
    if (quote === void 0) { quote = '"'; }
    if (typeof (obj) == "number" || typeof (obj) == "boolean") {
        return obj.toString();
    }
    else {
        return quote + obj.toString() + quote;
    }
}
//获取GUID
function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
//获取固定位数GUID
function NewGuidStr(len) {
    if (len === void 0) { len = 32; }
    return NewGuid().replace(/-/g, '').substr(0, len);
}
//浅表复制
function LightClone(t) {
    if (t instanceof Array) {
        return t.concat();
    }
    else {
        throw new Error("\u672A\u5B9E\u73B0" + t + "\u7684LightClone!");
    }
}
//深表复制
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
//将对象转换为字典
function ToDict(obj) {
    var dic = new Dictionary();
    $.Enumerable.From(obj).ForEach(function (item) {
        dic.Set(item.Key, item.Value);
    });
    return dic;
}
//循环
var Loop = (function () {
    function Loop() {
    }
    //For循环(循环次数)
    Loop.For = function (count) {
        var group = [];
        for (var i = 0; i < count; i++) {
            group.push(i);
        }
        return $.Enumerable.From(group);
    };
    return Loop;
}());
//初始化对象(对象,初始化函数)
function InitObj(obj, initFunc) {
    initFunc(obj);
    return obj;
}
var enumerable = $.Enumerable;
//将可枚举对象转换为列表
enumerable.prototype.ToList = function () {
    var group = new List();
    this.ForEach(function (item) { return group.Set(item); });
    return group;
};
enumerable.prototype.OrderByCompareFunc = function (func) {
    var group = this.ToArray();
    for (var i = 0; i < group.length - 1; i++) {
        for (var j = i + 1; j < group.length; j++) {
            if (func(group[i], group[j]) > 0) {
                var temp = group[i];
                group[i] = group[j];
                group[j] = temp;
            }
        }
    }
    return $.Enumerable.From(group);
};
//同步获取Ajax数据
function getAjaxData(url) {
    var response = $.ajax({ url: url, async: false });
    //如果状态为200则返回输出的文本
    var result = response.status == 200 ? response.responseText : None;
    return result;
}
//Base64转字节
function Base64ToByte(str) {
    var binStr = Base64ToBin(str);
    var group = new List();
    for (var i = 0; i < binStr.length; i += 8) {
        var byteStr = binStr.substr(i, 8);
        var byte = parseInt(byteStr, 2);
        group.Set(byte);
    }
    return group;
}
//Base64转二进制
function Base64ToBin(str) {
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
    var bitString = "";
    var tail = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] != "=") {
            var decode = code.indexOf(str[i]).toString(2);
            bitString += (new Array(7 - decode.length)).join("0") + decode;
        }
        else {
            tail++;
        }
    }
    return bitString.substr(0, bitString.length - tail * 2);
}
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

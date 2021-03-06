var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Interceptor = (function () {
    function Interceptor() {
        this._BefHandlerGroup = [];
        this._AftHandlerGroup = [];
    }
    Interceptor.prototype.SubBef = function (func) {
        this._BefHandlerGroup.push(func);
        return this;
    };
    Interceptor.prototype.SubBefForCast = function (func) {
        return this.SubBef(function (p) { return [func(p), true]; });
    };
    Interceptor.prototype.SubBefForValide = function (func) {
        return this.SubBef(function (p) { return [p, func(p)]; });
    };
    Interceptor.prototype.SubAft = function (func) {
        this._AftHandlerGroup.push(func);
        return this;
    };
    Interceptor.prototype.SubAftForCast = function (func) {
        return this.SubAft(function (_a) {
            var pResult = _a[0], p = _a[1];
            return func(pResult);
        });
    };
    Interceptor.prototype.Do = function (func, param) {
        //执行BefHandler,如果返回值为true则替换参数,否则停止执行并返回默认值,
        for (var _i = 0, _a = this._BefHandlerGroup; _i < _a.length; _i++) {
            var itemBef = _a[_i];
            var befResult = itemBef(param);
            param = befResult[0];
            if (!befResult[1]) {
                return None;
            }
        }
        //执行函数
        var result = func(param);
        //执行AftHandler,并替换返回值
        for (var _b = 0, _c = this._AftHandlerGroup; _b < _c.length; _b++) {
            var itemAft = _c[_b];
            result = itemAft([result, param]);
        }
        //返回结果
        return result;
    };
    return Interceptor;
}());
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
var ArrayHelper = (function () {
    function ArrayHelper() {
    }
    ArrayHelper.FromInt = function (from, to) {
        var group = [];
        for (var i = from; i <= to; i++) {
            group.push(i);
        }
        return group;
    };
    return ArrayHelper;
}());
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
                setTimeout(function () {
                    editor.showHint();
                }, 100);
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
        if (gramerInfo
            .GramerState ==
            CodeEdit.LangAnaly.Model.GramerInfoState.AutoComplete) {
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
        var firstParentName = parentMayNameGroup.FirstOrDefault("");
        //尖括号
        if (name == "<" || name == ">" || name == "</" || name == "/>") {
            style = "tag bracket";
        }
        else if (name == "Name") {
            //标签名(父节点为标签)
            if (firstParentName.indexOf("Tag") >= 0) {
                style = "tag";
            }
            else if (firstParentName.indexOf("Attribute") >= 0) {
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
        if (ranges.length > 0) {
            var range = ranges[0];
            setTimeout(function () {
                var gramerReader = analy._GramerReader;
                var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
                if (info.ParantMaySymbolGroup.Count() > 0 &&
                    info.ParantMaySymbolGroup.Get(0).Name == "Start Tag") {
                    var nameGramer = gramerReader
                        .GetClosetGrammer(function (item) { return item.Symbol.Name == "Name" &&
                        item.GetParentMaySymbolGroup()
                            .ToEnumerble()
                            .Any(function (sItem) { return sItem.Name.indexOf("Tag") >= 0; }); }, info.GramerInfo);
                    var tag = nameGramer.Value;
                    var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                    cm.replaceRange("\n\n</" + tag + ">", newPos, newPos);
                    //比上一行多一层缩进
                    cm.indentLine(range.head.line + 1, "prev", true);
                    cm.indentLine(range.head.line + 1, "add", true);
                    //比上一行少一层缩进
                    cm.indentLine(range.head.line + 2, "prev", true);
                    cm.indentLine(range.head.line + 2, "subtract", true);
                    //定位到中间行的尾部
                    newPos = CodeMirror.Pos(range.head.line + 1, cm.getLine(range.head.line + 1).length);
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
            var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
            console.log(info);
            if (info.ParantMaySymbolGroup.Count() > 0 &&
                info.ParantMaySymbolGroup.Get(0).Name == "Val" &&
                info.ParantMaySymbolGroup.ToEnumerble().Any(function (item) { return item.Name == "Attribute"; })) {
                var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                cm.replaceRange('"', newPos, newPos);
                cm.setSelections([{ head: newPos, anchor: newPos }]);
            }
        }, 0);
        return CodeMirror.Pass;
    };
    cm.addKeyMap(map);
});
CodeMirror.registerHelper("hint", "xml", function (cm, options) {
    var cur = cm.getCursor();
    var extend = cm.Extend;
    var analy = extend._LangAnaly;
    var analyInfo = analy.GetAnalyInfo(cur.line, cur.ch);
    console.log(analyInfo);
    return {
        list: ["abc", "123", "中文"],
        from: cur,
        to: cur
    };
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
            //自动补全不完整的语法(是否只补全可选的)
            GramerReader.prototype.AutoComplete = function (onlyOption) {
                if (onlyOption === void 0) { onlyOption = false; }
                //当前语法
                var grammer = this._GrammerGroup.Get().Item2;
                //空的(最开始)、错误的的不补全
                if (grammer == null ||
                    grammer.GramerState == LangAnaly.Model.GramerInfoState.Error) {
                    return false;
                }
                //对于补全可选的,完整的,非可选的不补全
                if (onlyOption && (this.IsComplete(grammer) || !this.IsInOptionPro(grammer))) {
                    return false;
                }
                var index = 0;
                //从当前状态开始不断移入节点,直到可以规约(根据语法信息)
                while (true) {
                    //当前状态堆栈(不包含错误元素)
                    var stateGroup = this._GrammerGroup.ToEnumerble()
                        .Where(function (item) { return item.Item2 == null || item.Item2.GramerState != LangAnaly.Model.GramerInfoState.Error; })
                        .Select(function (item) { return item.Item1; })
                        .ToList();
                    var curState = stateGroup.Get();
                    //可以完成的不补全
                    if (curState.CanAccept()) {
                        break;
                    }
                    //第二次Reduce则停止???
                    if (index > 0 && curState.CanReduce()) {
                        break;
                    }
                    //寻找第一个移入类的符号
                    var sym = curState.GetNextSymbol(stateGroup, this._EgtStorer.ProduceGroup);
                    //构造移入符号并读入符号(坐标为-1是为了不干扰定位)
                    var tokenInfo = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, sym, null, -1, -1, -1);
                    console.log(sym);
                    //如果是规约,则持续消耗符号
                    while (true) {
                        var grm = this.ReadGramer(tokenInfo);
                        if (grm.GramerState != LangAnaly.Model.GramerInfoState.Reduce) {
                            break;
                        }
                    }
                    index++;
                }
                if (index == 0) {
                    return false;
                }
                else {
                    //状态为自动补全
                    grammer.GramerState = LangAnaly.Model.GramerInfoState.AutoComplete;
                    return true;
                }
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
                var index = this._GrammerGroup.ToEnumerble()
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
                                    //从语法或 符号的开始索引之前查找 
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
                                return resultGrammer;
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Error) {
                                //如果是块开始元素,则撤销前面的语法(直至正确为止)
                                var autoMust = gramer.Symbol != null &&
                                    (this.BlockStartNameGroup.Contains(gramer.Symbol.Name) || token.Symbol.Name == "EOF");
                                //尝试补全语法
                                var isAutoComplete = this._GramerReader.AutoComplete(!autoMust);
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
                return null;
            };
            //获取指定位置的分析信息(行,列)     
            LangAnalyBase.prototype.GetAnalyInfo = function (line, col) {
                //如果位于语法树中,则返回语法信息和可能的父符号
                var grammer = this._GramerReader.GetGrammerInfo(line, col, this.ContentNameGroup);
                if (grammer != null) {
                    return new LangAnaly.Model.GramerAnalyInfo(grammer);
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
///<reference path="../LangAnalyBase.ts"/>
var CodeEdit;
///<reference path="../LangAnalyBase.ts"/>
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
///<reference path="../LangAnalyBase.ts"/>
var CodeEdit;
///<reference path="../LangAnalyBase.ts"/>
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
                function GramerAnalyInfo(gramerInfo) {
                    this.GramerInfo = gramerInfo;
                    this.ParantMaySymbolGroup = gramerInfo.GetParentMaySymbolGroup();
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
                //��ȡ���п��ܵĸ�����(��ǰ�﷨)
                GramerInfo.prototype.GetParentMaySymbolGroup = function () {
                    var parentMaySymbolGroup = new List();
                    //����и��﷨,��Ϊ���﷨�ķ���
                    if (this.Parent != null && this.GramerState != Model.GramerInfoState.Error) {
                        var parentGramer = this.Parent;
                        while (parentGramer != null) {
                            parentMaySymbolGroup.Set(parentGramer.Symbol);
                            parentGramer = parentGramer.Parent;
                        }
                    }
                    else if (this.MayParent != null) {
                        var parentGramer = this.MayParent;
                        while (parentGramer != null) {
                            parentMaySymbolGroup.Set(parentGramer.Symbol);
                            parentGramer = parentGramer.Parent;
                        }
                    }
                    else {
                        parentMaySymbolGroup = this.MayParentSymbolGroup;
                    }
                    return parentMaySymbolGroup;
                };
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
                    //#endregion
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
                //#region ���������׹�Լ�ķ���
                //��ȡ���������׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬,���в���ʽ)
                LALRState.prototype.GetNextSymbol = function (stateGroup, allProduce) {
                    var sym = null;
                    //��ȡ��ԼԪ��(���׹�Լ)
                    if (sym == null) {
                        sym = this.GetNextReduceSymbol(stateGroup);
                    }
                    //��ȡGoToԪ��(��������ʱһ�����Һ���ѭ��,���뱾��Ҳ��װ��ΪGoTo)
                    if (sym == null) {
                        sym = this.GetNextGotoSymbol(allProduce);
                    }
                    //��ȡ����Ԫ��
                    if (sym == null) {
                        sym = this.GetNextShiftSymbol();
                    }
                    return sym;
                };
                //��ȡ�����׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬)
                LALRState.prototype.GetNextReduceSymbol = function (stateGroup) {
                    var resultReduceGroup = new List();
                    //���Ϲ�Լ,ֱ�����ܹ�Լ
                    while (true) {
                        var curState = stateGroup.Get();
                        var reduceGroup = curState.GetActionGroup(Model.ActionType.Reduce);
                        if (reduceGroup.Count() < 1) {
                            break;
                        }
                        resultReduceGroup = reduceGroup;
                        LALRState.Reduce(stateGroup);
                    }
                    //ȡ��һ����Լ����Ԫ��
                    var sym = resultReduceGroup.ToEnumerble()
                        .Select(function (item) { return item.Symbol; })
                        .FirstOrDefault(null);
                    return sym;
                };
                //��ȡ��������ת�ķ���(���в���ʽ)
                LALRState.prototype.GetNextGotoSymbol = function (allProduce) {
                    //���ݲ���ʽ�Ĺ�ϵ,��ȡ��ת���Ĳ���ʽ
                    var sym = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Goto; })
                        .OrderByCompareFunc(function (a, b) { return Model.Produce.Compare(a.Symbol, b.Symbol, allProduce); })
                        .Select(function (item) { return item.Symbol; })
                        .FirstOrDefault(null);
                    return sym;
                };
                //��ȡ����������ķ���
                LALRState.prototype.GetNextShiftSymbol = function () {
                    //��ȡ���һ���������
                    var sym = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Shift; })
                        .Select(function (item) { return item.Symbol; })
                        .LastOrDefault(null);
                    return sym;
                };
                //#endregion
                //#reginon ��������
                //��Լ(��ǰ״̬��ջ:����������״̬)
                LALRState.Reduce = function (stateGroup) {
                    var curState = stateGroup.Get();
                    //������ܹ�Լ����false
                    if (!curState.CanReduce()) {
                        return false;
                    }
                    else {
                        var produce = curState.GetProduce();
                        var cnt = produce.SymbolGroup.Count();
                        //����������Ÿ���״̬
                        while (cnt > 0) {
                            stateGroup.Remove();
                            cnt--;
                        }
                        //ִ��GoTo��ת
                        var state = stateGroup.Get();
                        var nextState = state.GetAction(produce.NonTerminal).TargetState;
                        stateGroup.Set(nextState);
                        return true;
                    }
                };
                //�Ƿ���Խ���
                LALRState.prototype.CanAccept = function () {
                    var canAccept = this.ActionGroup.ToEnumerble().Any(function (item) { return item.Symbol.Name == "EOF"; });
                    return canAccept;
                };
                //�Ƿ���Թ�Լ
                LALRState.prototype.CanReduce = function () {
                    var canReduce = this.ActionGroup.ToEnumerble().Any(function (item) { return item.ActionType == Model.ActionType.Reduce; });
                    return canReduce;
                };
                //��ȡ����ʽ
                LALRState.prototype.GetProduce = function () {
                    var actionGroup = this.GetActionGroup(Model.ActionType.Reduce);
                    var produce = actionGroup.Count() > 0 ? actionGroup.Get(0).TargetRule : null;
                    return produce;
                };
                //��ȡָ�����Ͷ�������(��������)
                LALRState.prototype.GetActionGroup = function (typ) {
                    return this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == typ; })
                        .ToList();
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
var AttachProperty = (function () {
    function AttachProperty() {
    }
    return AttachProperty;
}());
var DelegateOne = (function () {
    function DelegateOne() {
        this.ActionGroup = new List();
    }
    DelegateOne.prototype.Subscribe = function (action) {
        this.ActionGroup.Set(action);
    };
    DelegateOne.prototype.UnSubscribe = function (action) {
        this.ActionGroup.RemoveItem(action);
    };
    DelegateOne.prototype.Do = function (param) {
        for (var _i = 0, _a = this.ActionGroup.ToArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            item(param);
        }
    };
    return DelegateOne;
}());
var DelegateTwo = (function () {
    function DelegateTwo() {
        this.ActionGroup = new List();
    }
    DelegateTwo.prototype.Subscribe = function (action) {
        this.ActionGroup.Set(action);
    };
    DelegateTwo.prototype.UnSubscribe = function (action) {
        this.ActionGroup.RemoveItem(action);
    };
    DelegateTwo.prototype.Do = function (param1, param2) {
        for (var _i = 0, _a = this.ActionGroup.ToArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            item(param1, param2);
        }
    };
    return DelegateTwo;
}());
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
    Dictionary.prototype.Contains = function (key) {
        return this.Index(key) >= 0;
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
    //转换为枚举
    Dictionary.prototype.ToEnumerble = function () {
        return $.Enumerable.From(this.ToArray());
    };
    return Dictionary;
}());
var DateMode;
(function (DateMode) {
    DateMode[DateMode["Date"] = 0] = "Date";
    DateMode[DateMode["Time"] = 1] = "Time";
    DateMode[DateMode["DateTime"] = 2] = "DateTime";
})(DateMode || (DateMode = {}));
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
var Lookup = (function (_super) {
    __extends(Lookup, _super);
    function Lookup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Lookup;
}(Dictionary));
var ObjBase = (function () {
    function ObjBase() {
        this._ExtData = new Dictionary();
    }
    ObjBase.prototype.GetExtData = function (name, dft) {
        var val = this._ExtData.Get(name, dft);
        return val;
    };
    ObjBase.prototype.SetExtData = function (key, value) {
        this._ExtData.Set(key, value);
        return this;
    };
    ObjBase.prototype.GetMemberValue = function (memberName) {
        if (typeof this[memberName] == "undefined") {
            return None;
        }
        else {
            return this[memberName];
        }
    };
    ObjBase.prototype.SetMemberValue = function (memberName, value) {
        this[memberName] = value;
        return this;
    };
    return ObjBase;
}());
var Size = (function () {
    function Size(width, height) {
        this.Width = width;
        this.Height = height;
    }
    return Size;
}());
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
var Table = (function () {
    function Table(colCount) {
        this.Data = [];
        this.Pos = LinePoint.Empty;
        this.ColCount = colCount;
    }
    Table.prototype.Add = function (size, obj) {
        size = DeepClone(size);
        size.Width = Math.min(size.Width, this.ColCount);
        //查找新的Point
        this.Pos = this.Mark(this.Pos, size, obj);
        return this;
    };
    Table.prototype.Mark = function (point, size, obj) {
        //如果超过长度则转到下一行
        if (point.X + size.Width > this.ColCount) {
            return this.Mark(new LinePoint(point.Index, 0, point.Y + 1), size, obj);
        }
        //从当前位置开始,检查是否有Size大小的空间.如果没有则转到下一列
        for (var i = point.Y; i < point.Y + size.Height; i++) {
            this.EnsurRow(i);
            for (var j = point.X; j < point.X + size.Width; j++) {
                if (this.Data[i][j]) {
                    return this.Mark(new LinePoint(point.Index, point.X + 1, point.Y), size, obj);
                }
            }
        }
        //标记已被使用
        for (var i = point.Y; i < point.Y + size.Height; i++) {
            for (var j = point.X; j < point.X + size.Width; j++) {
                this.Data[i][j] = obj;
            }
        }
        //返回下一个元素的起始坐标
        return new LinePoint(point.Index + 1, point.X + size.Width, point.Y);
    };
    Table.prototype.EnsurRow = function (row) {
        if (!this.Data[row]) {
            this.Data[row] = [];
        }
        return this;
    };
    return Table;
}());
//元组
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
    //obj是类型
    if (obj.prototype) {
        return obj;
    }
    else {
        return obj.constructor;
    }
}
function getParentType(type) {
    return type.prototype && type.prototype.__proto__ ? type.prototype.__proto__.constructor : null;
}
//是否为某个类型
function IsType(type, baseType) {
    type = GetType(type);
    baseType = GetType(baseType);
    while (type) {
        if (type == baseType) {
            return true;
        }
        type = getParentType(type);
    }
    return false;
}
//判断一个对象是否为空
function IsEmpty(obj) {
    return obj === null || obj === "" || obj === None || typeof (obj) == "undefined";
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
$.fn.ToHtml = function () {
    return $(this)[0].outerHTML;
};
var MetaData;
(function (MetaData) {
    var AtrInfo = (function () {
        function AtrInfo(name, valLimit) {
            if (valLimit === void 0) { valLimit = null; }
            this.Type = MetaData.SimpleType.string;
            this.Required = false;
            this.Name = name;
            this.ValLimit = valLimit;
            if (valLimit != null) {
                this.Type = valLimit.Type;
                this.Required = valLimit.Required;
            }
        }
        return AtrInfo;
    }());
    MetaData.AtrInfo = AtrInfo;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ElmGroupMode;
    (function (ElmGroupMode) {
        ElmGroupMode[ElmGroupMode["Strict"] = 0] = "Strict";
        ElmGroupMode[ElmGroupMode["Loose"] = 1] = "Loose";
    })(ElmGroupMode = MetaData.ElmGroupMode || (MetaData.ElmGroupMode = {}));
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ElmGroupType;
    (function (ElmGroupType) {
        ElmGroupType[ElmGroupType["Once"] = 0] = "Once";
        ElmGroupType[ElmGroupType["Choice"] = 1] = "Choice";
        ElmGroupType[ElmGroupType["Many"] = 2] = "Many";
    })(ElmGroupType = MetaData.ElmGroupType || (MetaData.ElmGroupType = {}));
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ElmInfo = (function () {
        function ElmInfo(name, type) {
            this.Name = name;
            this.Type = type;
        }
        return ElmInfo;
    }());
    MetaData.ElmInfo = ElmInfo;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var SimpleType;
    (function (SimpleType) {
        SimpleType[SimpleType["string"] = 0] = "string";
        SimpleType[SimpleType["byte"] = 1] = "byte";
        SimpleType[SimpleType["int"] = 2] = "int";
        SimpleType[SimpleType["long"] = 3] = "long";
        SimpleType[SimpleType["double"] = 4] = "double";
        SimpleType[SimpleType["bool"] = 5] = "bool";
        SimpleType[SimpleType["datetime"] = 6] = "datetime";
        SimpleType[SimpleType["date"] = 7] = "date";
        SimpleType[SimpleType["time"] = 8] = "time";
        SimpleType[SimpleType["enum"] = 9] = "enum";
    })(SimpleType = MetaData.SimpleType || (MetaData.SimpleType = {}));
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var TypeInfo = (function () {
        function TypeInfo(name, base) {
            if (base === void 0) { base = null; }
            this.Name = name;
            this.Base = base;
        }
        TypeInfo.prototype.GetAttrGroup = function () {
            var group = this.Base.GetAttrGroup();
            group.SetRange(this.AtrGroup);
            return group;
        };
        TypeInfo.prototype.GetElmGroup = function () {
            var group = this.Base.GetElmGroup();
            group.SetRange(this.ElmGroup);
            return group;
        };
        return TypeInfo;
    }());
    MetaData.TypeInfo = TypeInfo;
})(MetaData || (MetaData = {}));
function HtmlAtr(atrType) {
    var htmlAtrInfo = new MetaData.HtmlAtrInfo(atrType);
    return function (target, propertyKey) {
        MetaDataHelper.SetAtr(target, htmlAtrInfo, propertyKey);
    };
}
var MetaData;
(function (MetaData) {
    var HtmlAtrInfo = (function () {
        function HtmlAtrInfo(type) {
            this.Type = type;
        }
        return HtmlAtrInfo;
    }());
    MetaData.HtmlAtrInfo = HtmlAtrInfo;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var HtmlAtrType;
    (function (HtmlAtrType) {
        HtmlAtrType[HtmlAtrType["HtmlAtr"] = 0] = "HtmlAtr";
        HtmlAtrType[HtmlAtrType["StyleAtr"] = 1] = "StyleAtr";
    })(HtmlAtrType = MetaData.HtmlAtrType || (MetaData.HtmlAtrType = {}));
})(MetaData || (MetaData = {}));
var MetaDataHelper = (function () {
    function MetaDataHelper() {
    }
    /**************特性相关操作**************/
    //附加特性(类型,特性,成员名称)
    MetaDataHelper.SetAtr = function (type, val, memberName) {
        if (memberName === void 0) { memberName = null; }
        this._Dic.Get(type, new Lookup())
            .Get(memberName, new List())
            .Set(val);
    };
    //获取特性(类型,值,成员名称)
    MetaDataHelper.GetAtr = function (type, atrType, memberName) {
        if (memberName === void 0) { memberName = null; }
        var item = this.GetAllAtr(type, atrType, memberName)
            .ToEnumerble()
            .FirstOrDefault(null);
        return item;
    };
    //获取所有特性(类型,值,成员名称)
    MetaDataHelper.GetAllAtr = function (type, atrType, memberName) {
        if (memberName === void 0) { memberName = null; }
        var group = this._Dic.ToEnumerble()
            .Where(function (item) { return IsType(type, item.Item1); })
            .SelectMany(function (item) { return item.Item2.ToArray(); })
            .Where(function (item) { return item.Item1 == memberName; })
            .SelectMany(function (item) { return item.Item2.ToArray(); })
            .Where(function (item) { return IsType(atrType, item); })
            .ToList();
        return group;
    };
    /**************反射相关操作**************/
    //获取所有类型(命名空间,基类型)
    MetaDataHelper.GetAllType = function (nameSpace, baseType) {
        if (baseType === void 0) { baseType = null; }
        var group = new List();
        for (var key in nameSpace) {
            var item = nameSpace[key];
            if (!baseType || IsType(item, baseType)) {
                group.Set(item);
            }
        }
        return group;
    };
    //获取所有属性名称(类型)
    MetaDataHelper.GetAllPropName = function (type) {
        var group = this._Dic.ToEnumerble()
            .Where(function (item) { return IsType(type, item.Item1); })
            .SelectMany(function (item) { return item.Item2.ToArray(); })
            .Select(function (item) { return item.Item1; })
            .Distinct()
            .ToList();
        return group;
    };
    //获取所有类型元信息(命名空间,基类型)
    MetaDataHelper.GetAllTypeInfo = function (nameSpace, baseType) {
        var _this = this;
        if (baseType === void 0) { baseType = null; }
        var typeGroup = this.GetAllType(nameSpace, baseType);
        var typeInfoGroup = new Dictionary();
        typeGroup.ToEnumerble()
            .ForEach(function (item) {
            var info = _this.GetTypeInfo(item);
            typeInfoGroup.Set(item, info);
        });
        return typeInfoGroup;
    };
    //获取类型元信息(类型)
    MetaDataHelper.GetTypeInfo = function (type) {
        if (this._TypeInfoDic.Contains(type)) {
            return this._TypeInfoDic.Get(type);
        }
        //处理父类
        var parentType = getParentType(type);
        var parentInfo = parentType ? this.GetTypeInfo(parentType) : null;
        //处理当前类
        var typeInfo = new MetaData.TypeInfo(type.name, parentInfo);
        this._TypeInfoDic.Set(type, typeInfo);
        //处理
        return typeInfo;
    };
    //获取所有属性元信息(类型)
    MetaDataHelper.GetAtrInfo = function (type, atrName) {
        var atr = this.GetAtr(type, MetaData.ValLimitBase, atrName);
        var atrInfo = new MetaData.AtrInfo(atrName, atr);
        return atrInfo;
    };
    return MetaDataHelper;
}());
MetaDataHelper._Dic = new Dictionary();
/**************元数据相关操作**************/
MetaDataHelper._TypeInfoDic = new Dictionary();
function ValLimitAtr(valLimit) {
    return function (target, propertyKey) {
        MetaDataHelper.SetAtr(target, valLimit, propertyKey);
    };
}
var MetaData;
(function (MetaData) {
    var ValLimitBase = (function () {
        function ValLimitBase(type, pattern) {
            if (pattern === void 0) { pattern = null; }
            this.Required = false;
            this.Pattern = "";
            this.Pattern = pattern;
        }
        ValLimitBase.prototype.Valid = function (val) {
            var inValidMsgGroup = new List();
            if (this.Required && IsEmpty(val)) {
                inValidMsgGroup.Set("���ֶ��Ǳ����!");
            }
            if (!IsEmpty(val)) {
                inValidMsgGroup.SetRange(this.ValidInner(val));
                if (!IsEmpty(this.Pattern) && !new RegExp(this.Pattern).test(val)) {
                    inValidMsgGroup.Set("��ʽ����ȷ!");
                }
            }
            return inValidMsgGroup;
        };
        ValLimitBase.prototype.ValidInner = function (val) {
            return new List();
        };
        return ValLimitBase;
    }());
    MetaData.ValLimitBase = ValLimitBase;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ValLimitForBool = (function (_super) {
        __extends(ValLimitForBool, _super);
        function ValLimitForBool() {
            var _this = _super.call(this, MetaData.SimpleType.bool) || this;
            _this._ChioceGroup = new List(["true", "false", "1", "0"]);
            return _this;
        }
        ValLimitForBool.prototype.ValidInner = function (val) {
            var msgGroup = new List();
            var lowerVal = val.toLowerCase();
            if (!this._ChioceGroup.Contains(lowerVal)) {
                msgGroup.Set("ֵֻ��Ϊ:" + this._ChioceGroup.ToArray().join() + "!");
            }
            return msgGroup;
        };
        return ValLimitForBool;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForBool = ValLimitForBool;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ValLimitForDataTime = (function (_super) {
        __extends(ValLimitForDataTime, _super);
        function ValLimitForDataTime(dateType, dateMode, parttern) {
            if (dateType === void 0) { dateType = null; }
            if (dateMode === void 0) { dateMode = DateMode.Date; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, MetaData.SimpleType.datetime, parttern) || this;
            _this.DateMode = dateMode;
            return _this;
        }
        ValLimitForDataTime.prototype.ValidInner = function (val) {
            var msgGroup = new List();
            //��������
            var dateRegex = '\\d{4}/\\d{2}/\\d{2}';
            var timeRegex = '\\d{2}:\\d{2}:\\d{2}';
            var regexStr = "";
            if (this.DateMode == DateMode.Date) {
                regexStr = dateRegex;
            }
            else if (this.DateMode == DateMode.Time) {
                regexStr = timeRegex;
            }
            else if (this.DateMode == DateMode.DateTime) {
                regexStr = "(" + dateRegex + ")\\s+(" + timeRegex + ")";
            }
            regexStr = "^" + regexStr + "$";
            //��ʽУ��
            var eroMsg = this.DateMode == DateMode.Date ? "���ڸ�ʽ����ȷ!" : "ʱ���ʽ����ȷ!";
            var regex = new RegExp(regexStr);
            if (!regex.test(val)) {
                msgGroup.Set(eroMsg);
            }
            else {
                var dateStr = "";
                var timeStr = "";
                if (this.DateMode == DateMode.Date) {
                    dateStr = val;
                }
                else if (this.DateMode == DateMode.Time) {
                    timeStr = val;
                }
                else if (this.DateMode == DateMode.DateTime) {
                    dateStr = regex.exec(val)[1];
                    timeStr = regex.exec(val)[2];
                }
                var isValid = true;
                if (isValid && dateStr) {
                    var date = new Date(dateStr);
                    var dateStrGroup = dateStr.split('/');
                    isValid = date.getFullYear() == parseInt(dateStrGroup[0]) &&
                        (date.getMonth() + 1) == parseInt(dateStrGroup[1]) &&
                        date.getDate() == parseInt(dateStrGroup[2]);
                }
                if (isValid && timeStr) {
                    var timeStrGroup = timeStr.split(':');
                    var hour = parseInt(timeStrGroup[0]);
                    var min = parseInt(timeStrGroup[1]);
                    var second = parseInt(timeStrGroup[1]);
                    isValid = hour >= 0 && hour < 24 && min >= 0 && min < 60 && second >= 0 && second < 60;
                }
                if (!isValid) {
                    msgGroup.Set(eroMsg);
                }
            }
            return msgGroup;
        };
        return ValLimitForDataTime;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForDataTime = ValLimitForDataTime;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ValLimitForInt = (function (_super) {
        __extends(ValLimitForInt, _super);
        function ValLimitForInt(min, max, parttern) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, MetaData.SimpleType.int, parttern) || this;
            _this.Min = min;
            _this.Max = max;
            return _this;
        }
        ValLimitForInt.prototype.ValidInner = function (val) {
            var msgGroup = new List();
            if (!/^[1-9]\d*$/.test(val)) {
                msgGroup.Set("��������!");
            }
            else {
                var valInt = parseInt(val, 10);
                //�Ƿ�������
                var isIn = (!IsEmpty(this.Min) && valInt >= this.Min) || (!IsEmpty(this.Max) && valInt <= this.Max);
                //���ô�����Ϣ
                if (!isIn) {
                    if (!IsEmpty(this.Min) && !IsEmpty(this.Max)) {
                        msgGroup.Set("\u05B5\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD" + this.Min + "~" + this.Max + "\uFFFD\uFFFD\uFFFD\uFFFD!");
                    }
                    else if (!IsEmpty(this.Min)) {
                        msgGroup.Set("\uFFFD\uFFFD\uFFFD\uFFFD\u0421\uFFFD\uFFFD" + this.Min + "!");
                    }
                    else if (!IsEmpty(this.Max)) {
                        msgGroup.Set("\uFFFD\uFFFD\uFFFD\u0734\uFFFD\uFFFD\uFFFD" + this.Max + "!");
                    }
                }
            }
            return msgGroup;
        };
        return ValLimitForInt;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForInt = ValLimitForInt;
})(MetaData || (MetaData = {}));
///<reference path="ValLimitForInt.ts"/>
var MetaData;
///<reference path="ValLimitForInt.ts"/>
(function (MetaData) {
    var ValLimitForDouble = (function (_super) {
        __extends(ValLimitForDouble, _super);
        function ValLimitForDouble(min, max, fraction, parttern) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            if (fraction === void 0) { fraction = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, min, max, parttern) || this;
            _this.Fraction = fraction;
            return _this;
        }
        ValLimitForDouble.prototype.ValidInner = function (val) {
            var msgGroup = new List();
            if (!/^[1-9]\d*(\.\d+)?$/.test(val)) {
                msgGroup.Set("��������!");
            }
            else {
                var valDouble = parseFloat(val);
                //�Ƿ�������
                var isIn = (!IsEmpty(this.Min) && valDouble >= this.Min) || (!IsEmpty(this.Max) && valDouble <= this.Max);
                //���ô�����Ϣ
                if (!isIn) {
                    if (!IsEmpty(this.Min) && !IsEmpty(this.Max)) {
                        msgGroup.Set("\u05B5\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD" + this.Min + "~" + this.Max + "\uFFFD\uFFFD\uFFFD\uFFFD!");
                    }
                    else if (!IsEmpty(this.Min)) {
                        msgGroup.Set("\uFFFD\uFFFD\uFFFD\uFFFD\u0421\uFFFD\uFFFD" + this.Min + "!");
                    }
                    else if (!IsEmpty(this.Max)) {
                        msgGroup.Set("\uFFFD\uFFFD\uFFFD\u0734\uFFFD\uFFFD\uFFFD" + this.Max + "!");
                    }
                }
            }
            return msgGroup;
        };
        return ValLimitForDouble;
    }(MetaData.ValLimitForInt));
    MetaData.ValLimitForDouble = ValLimitForDouble;
})(MetaData || (MetaData = {}));
var MetaData;
(function (MetaData) {
    var ValLimitForStr = (function (_super) {
        __extends(ValLimitForStr, _super);
        function ValLimitForStr(minLength, maxLength, parttern) {
            if (minLength === void 0) { minLength = null; }
            if (maxLength === void 0) { maxLength = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, MetaData.SimpleType.string, parttern) || this;
            _this.MinLength = minLength;
            _this.MaxLength = maxLength;
            return _this;
        }
        ValLimitForStr.prototype.ValidInner = function (val) {
            var msgGroup = new List();
            var length = val.length;
            //�Ƿ�������
            var isIn = (!IsEmpty(this.MinLength) && length >= this.MinLength) || (!IsEmpty(this.MaxLength) && length <= this.MaxLength);
            //���ô�����Ϣ
            if (!isIn) {
                if (!IsEmpty(this.MinLength) && !IsEmpty(this.MaxLength)) {
                    msgGroup.Set("\uFFFD\uFFFD\uFFFD\u0231\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD" + this.MinLength + "~" + this.MaxLength + "\uFFFD\uFFFD\uFFFD\uFFFD!");
                }
                else if (!IsEmpty(this.MinLength)) {
                    msgGroup.Set("\uFFFD\uFFFD\uFFFD\u0232\uFFFD\uFFFD\uFFFD\u0421\uFFFD\uFFFD" + this.MinLength + "!");
                }
                else if (!IsEmpty(this.MaxLength)) {
                    msgGroup.Set("\uFFFD\uFFFD\uFFFD\u0232\uFFFD\uFFFD\u0734\uFFFD\uFFFD\uFFFD" + this.MaxLength + "!");
                }
            }
            return msgGroup;
        };
        return ValLimitForStr;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForStr = ValLimitForStr;
})(MetaData || (MetaData = {}));
var HtmlWraper = (function () {
    function HtmlWraper(html) {
        this._Html$ = $(html);
    }
    HtmlWraper.prototype.GetAtr = function (atrName) {
        return this._Html$.attr(atrName);
    };
    HtmlWraper.prototype.SetAtr = function (attrName, attrVal) {
        if (attrVal != None) {
            this._Html$.attr(attrName, attrVal.toString());
        }
        return this;
    };
    HtmlWraper.prototype.SetStyle = function (cssName, cssVal) {
        if (cssVal != None) {
            this._Html$.css(cssName, cssVal.toString());
        }
        return this;
    };
    HtmlWraper.prototype.ReplaceStyle = function (style) {
        if (style != None) {
            this._Html$.attr("style", style);
        }
        return this;
    };
    HtmlWraper.prototype.AddClass = function (clsName) {
        if (clsName != None) {
            this._Html$.addClass(clsName.toString());
        }
        return this;
    };
    //AddEasyUIOption(optionName: string, optionVal: any) {
    //    if (optionVal != None) {
    //        var keyValue = `${optionName}:${ToValueStr(optionVal, "'")}`;
    //        var option = this._Html$.attr('data-options');
    //        option = option ? option + "," + keyValue : keyValue;
    //        this._Html$.attr('data-options', option);
    //    }
    //    return this;
    //}
    HtmlWraper.prototype.AppendHtml = function (html) {
        if (!IsEmpty(html)) {
            this._Html$.append(html);
        }
        return this;
    };
    HtmlWraper.prototype.ToHtml = function () {
        return this._Html$.ToHtml();
    };
    return HtmlWraper;
}());
HtmlWraper.Empty = new HtmlWraper("");
var Control = (function (_super) {
    __extends(Control, _super);
    function Control() {
        var _this = _super.call(this) || this;
        //@ValLimitAtr(new MetaData.ValLimitForStr())
        _this.ID = NewGuidStr(6);
        _this.Width = "100%";
        _this.Height = "100%";
        _this.Title = "";
        _this.ClassName = "";
        _this.Style = "";
        _this.TagObj = {};
        _this.Parent = null;
        _this.ChildGroup = [];
        _this.IsInited = false;
        return _this;
    }
    Control.prototype.GetHtml = function () {
        this.SetTag(this.TagObj);
        //获取Html
        var html = this.GetHtmlInner();
        var htmlWrapper = new HtmlWraper(html);
        //添加属性
        this.IncludeHtmlAtr(htmlWrapper);
        //添加子元素Html
        var sonHtml = "";
        for (var _i = 0, _a = this.ChildGroup; _i < _a.length; _i++) {
            var item = _a[_i];
            sonHtml += this.GetChildHtml(item);
        }
        if (sonHtml) {
            htmlWrapper.AppendHtml(sonHtml);
        }
        return htmlWrapper.ToHtml();
    };
    Control.prototype.GetChildHtml = function (control) {
        return control.GetHtml();
    };
    Control.prototype.Init = function () {
        this.InitInner();
        for (var _i = 0, _a = this.ChildGroup; _i < _a.length; _i++) {
            var item = _a[_i];
            item.Init();
        }
        this.IsInited = true;
    };
    Control.prototype.SetTag = function (tagObj) {
    };
    Control.prototype.GetHtmlInner = function () {
        return None;
    };
    Control.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    };
    Control.prototype.InitInner = function () {
    };
    Control.prototype.IncludeHtmlAtr = function (htmlWrapper) {
        var type = GetType(this);
        htmlWrapper.AddClass(this.ClassName || None);
        htmlWrapper.ReplaceStyle(this.Style || None);
        for (var _i = 0, _a = MetaDataHelper.GetAllPropName(type).ToArray(); _i < _a.length; _i++) {
            var propName = _a[_i];
            var htmlAtrInfo = MetaDataHelper.GetAtr(type, MetaData.HtmlAtrInfo, propName);
            if (htmlAtrInfo == null) {
                continue;
            }
            if (htmlAtrInfo.Type == MetaData.HtmlAtrType.HtmlAtr) {
                htmlWrapper.SetAtr(propName.toLowerCase(), this.GetMemberValue(propName));
            }
            else if (htmlAtrInfo.Type == MetaData.HtmlAtrType.StyleAtr) {
                htmlWrapper.SetStyle(propName.toLowerCase(), this.GetMemberValue(propName));
            }
        }
        this.IncludeHtmlAtrInner(htmlWrapper);
        return htmlWrapper;
    };
    return Control;
}(ObjBase));
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
], Control.prototype, "ID", void 0);
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
], Control.prototype, "Width", void 0);
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
], Control.prototype, "Height", void 0);
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
], Control.prototype, "Title", void 0);
var FormControl = (function (_super) {
    __extends(FormControl, _super);
    function FormControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Enable = true;
        return _this;
    }
    FormControl.prototype.SetEnable = function (isEnable) {
        this.Enable = isEnable;
    };
    return FormControl;
}(Control));
///<reference path="FormControl.ts"/>
var ValidateBox = (function (_super) {
    __extends(ValidateBox, _super);
    function ValidateBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Required = false;
        _this.Editable = true;
        _this.Prompt = "";
        _this.ValLimit = null;
        _this.Formatter = null;
        _this.OnChange = new DelegateTwo();
        return _this;
    }
    ValidateBox.prototype.Valid = function () {
    };
    ValidateBox.prototype.IsValid = function () {
        return true;
    };
    ValidateBox.prototype.SetEditable = function (isEditable) {
        this.Editable = isEditable;
    };
    ValidateBox.prototype.GetValue = function () {
        return None;
    };
    ValidateBox.prototype.SetValue = function (val) {
    };
    return ValidateBox;
}(FormControl));
///<reference path="ValidateBox.ts"/>
var DateBox = (function (_super) {
    __extends(DateBox, _super);
    function DateBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Mode = DateMode.Date;
        return _this;
    }
    return DateBox;
}(ValidateBox));
///<reference path="ValidateBox.ts"/>
var NoInputValidateBox = (function (_super) {
    __extends(NoInputValidateBox, _super);
    function NoInputValidateBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoInputValidateBox.prototype.SetEditable = function (isEditable) {
        this.Editable = isEditable;
        _super.prototype.SetEnable.call(this, isEditable);
    };
    return NoInputValidateBox;
}(ValidateBox));
var NumberBox = (function (_super) {
    __extends(NumberBox, _super);
    function NumberBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Precision = 0;
        return _this;
    }
    return NumberBox;
}(ValidateBox));
var SelectBox = (function (_super) {
    __extends(SelectBox, _super);
    function SelectBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ValueField = "Value";
        _this.TextField = "Text";
        _this.Multiple = false;
        _this.OnSelect = new DelegateTwo();
        return _this;
    }
    SelectBox.prototype.GetData = function () {
        return None;
    };
    SelectBox.prototype.SetData = function (data) {
    };
    return SelectBox;
}(ValidateBox));
var SliderBox = (function (_super) {
    __extends(SliderBox, _super);
    function SliderBox() {
        var _this = _super.call(this) || this;
        _this.IsRange = false;
        _this.Width = '98%';
        return _this;
    }
    return SliderBox;
}(NumberBox));
///<reference path="ValidateBox.ts"/>
var SwitchBox = (function (_super) {
    __extends(SwitchBox, _super);
    function SwitchBox() {
        var _this = _super.call(this) || this;
        _this.Style += "max-width:70px;";
        return _this;
    }
    return SwitchBox;
}(ValidateBox));
///<reference path="ValidateBox.ts"/>
var TextBox = (function (_super) {
    __extends(TextBox, _super);
    function TextBox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = TextBoxType.Text;
        _this.Multiline = false;
        return _this;
    }
    return TextBox;
}(ValidateBox));
var TextBoxType;
(function (TextBoxType) {
    TextBoxType[TextBoxType["Text"] = 0] = "Text";
    TextBoxType[TextBoxType["Password"] = 1] = "Password";
})(TextBoxType || (TextBoxType = {}));
var DockLayout = (function (_super) {
    __extends(DockLayout, _super);
    function DockLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Top = null;
        _this.Left = null;
        _this.Center = null;
        _this.Right = null;
        _this.Bottom = null;
        return _this;
    }
    return DockLayout;
}(Control));
DockLayout.Split = new AttachProperty();
var GridLayout = (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout(colCount) {
        var _this = _super.call(this) || this;
        _this.CellPadding = "0px";
        _this.CellSpacing = "16";
        _this.Border = "0px";
        _this.ColCount = 1;
        _this.ColWidthGroup = [];
        _this.RowHeightGroup = [];
        _this.ColCount = colCount;
        return _this;
    }
    GridLayout.prototype.GetHtmlInner = function () {
        return '<table style="table-layout:fixed;"><tbody/></table>';
    };
    GridLayout.prototype.GetChildHtml = function (control) {
        var _this = this;
        //获取参数
        //debugger;
        var html = control.GetHtml();
        var index = this.ChildGroup.indexOf(control);
        //重新初始化Table
        var isFirst = index == 0;
        if (isFirst) {
            this._Table = new Table(this.ColCount);
        }
        //填充Table结构,获得位置
        var curPoint = this._Table.Pos;
        var size = new Size(control.GetExtData(GridLayout.ColSpan, 1), control.GetExtData(GridLayout.RowSpan, 1));
        this._Table.Add(size, control);
        var nextPoint = this._Table.Pos;
        //包括td
        html = "<td rowspan='" + size.Height + "' colspan='" + size.Width + "'>" + html + "</td>";
        //如果换了行
        if (isFirst || nextPoint.Y > curPoint.Y) {
            var heightStr = this.RowHeightGroup[nextPoint.Y] ? "height=" + this.RowHeightGroup[nextPoint.Y] : "";
            html = (isFirst ? '</colgroup>' : '</tr>') + ("<tr " + heightStr + ">") + html;
        }
        //如果是首行
        if (isFirst) {
            //首行限制宽度
            var headHtml = "<colgroup>";
            headHtml += $.Enumerable.From(ArrayHelper.FromInt(0, this.ColCount - 1))
                .Select(function (i) { return "<col " + (_this.ColWidthGroup[i] ? "width='" + _this.ColWidthGroup[i] + "'" : "") + "/>"; })
                .ToArray()
                .join("");
            html = headHtml + html;
        }
        //如果是末行
        var isLast = index == this.ChildGroup.length - 1;
        if (isLast) {
            html = html + '</tr>';
        }
        return html;
    };
    return GridLayout;
}(Control));
GridLayout.RowSpan = new AttachProperty();
GridLayout.ColSpan = new AttachProperty();
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
], GridLayout.prototype, "CellPadding", void 0);
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
], GridLayout.prototype, "CellSpacing", void 0);
__decorate([
    HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
], GridLayout.prototype, "Border", void 0);
var Panel = (function (_super) {
    __extends(Panel, _super);
    function Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Collapsible = false;
        _this.Fit = false;
        return _this;
    }
    return Panel;
}(Control));
__decorate([
    ValLimitAtr(new MetaData.ValLimitForBool())
], Panel.prototype, "Collapsible", void 0);
__decorate([
    ValLimitAtr(new MetaData.ValLimitForBool())
], Panel.prototype, "Fit", void 0);
var TabsLayout = (function (_super) {
    __extends(TabsLayout, _super);
    function TabsLayout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.OnSelect = new DelegateOne();
        return _this;
    }
    TabsLayout.prototype.Add = function (title, content, closable, Icon) {
        if (closable === void 0) { closable = false; }
        if (Icon === void 0) { Icon = ""; }
    };
    TabsLayout.prototype.Close = function (title) {
    };
    TabsLayout.prototype.Exists = function (title) {
        return false;
    };
    TabsLayout.prototype.Select = function (title) {
    };
    return TabsLayout;
}(Control));
var LinkButton = (function (_super) {
    __extends(LinkButton, _super);
    function LinkButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Text = "";
        _this.IconCls = "";
        _this.IsEnable = true;
        _this.OnClick = new DelegateOne();
        return _this;
    }
    LinkButton.prototype.SetEnable = function (isEnable) {
        this.IsEnable = isEnable;
    };
    return LinkButton;
}(Control));
var RawControl = (function (_super) {
    __extends(RawControl, _super);
    function RawControl(html, containerTag) {
        if (containerTag === void 0) { containerTag = "span"; }
        var _this = _super.call(this) || this;
        if (containerTag) {
            html = "<" + containerTag + ">" + html + "</" + containerTag + ">";
        }
        _this._Html = html;
        return _this;
    }
    RawControl.prototype.GetHtmlInner = function () {
        return this._Html;
    };
    return RawControl;
}(Control));
var UI;
(function (UI) {
    var Control = (function () {
        function Control() {
            this.Width = None;
            this.Height = None;
        }
        return Control;
    }());
    UI.Control = Control;
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Cols = 1;
            _this.ChildGroup = new List();
            return _this;
        }
        return Grid;
    }(Control));
    __decorate([
        ValLimitAtr(new MetaData.ValLimitForInt(10, 100))
    ], Grid.prototype, "Cols", void 0);
    UI.Grid = Grid;
    var TextBox = (function (_super) {
        __extends(TextBox, _super);
        function TextBox() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Enable = true;
            return _this;
        }
        return TextBox;
    }(Control));
    UI.TextBox = TextBox;
    var Other = (function () {
        function Other() {
        }
        return Other;
    }());
    UI.Other = Other;
})(UI || (UI = {}));
//setTimeout(function() {
//        var typeInfoGroup = MetaDataHelper.GetAllTypeInfo(UI, UI.Control);
//        $.Enumerable.From(typeInfoGroup.ToArray())
//            .ForEach(item => {
//                console.log(item.Item2);
//            });
//    },
//    0);
//function init() {
//    var classgroup = getAll();
//    var typeInfoGroup = new Dictionary<any,MetaData.TypeInfo>();
//   classgroup.ToEnumerble()
//        .ForEach(item => {
//            fillTypeInfo(item, typeInfoGroup, classgroup);
//        });
//   console.log($.Enumerable.From(typeInfoGroup.ToArray()).Select(item=>item.Item2).ToArray());
//}
//function getAll():List<any> {
//    var group = new List<any>();
//    for (var key in UI) {
//        var item = UI[key];
//        if (IsType(item, UI.Control)) {
//            group.Set(item);
//        }
//    }
//    return group;
//}
//function fillTypeInfo(controlType: any, infoGroup: Dictionary<any,MetaData.TypeInfo>, typeGroup: List<any>): MetaData.TypeInfo {
//    if (infoGroup.Contains(controlType)) {
//        return infoGroup.Get(controlType);
//    }
//    var parent = getParentType(controlType);
//    var parentType = null;
//    if (typeGroup.Contains(parent)) {
//        parentType = fillTypeInfo(parent, infoGroup, typeGroup);
//    }
//    var typeInfo = new MetaData.TypeInfo(controlType.name, parentType);
//    infoGroup.Set(controlType,typeInfo);
//    return typeInfo;
//}
//setTimeout(function() {
//        for (var item in UI) {
//            if (IsType(UI[item], UI.Control)) {
//                console.log(GetType(UI[item]).name);
//                new MetaData.TypeInfo("")
//            }
//        }
//    },
//    0);
/*
//var control = new MetaData.TypeInfo("Control");

//var container = new MetaData.TypeInfo("Container");
//var grid = new MetaData.TypeInfo("Grid",container);
//var widthAtr = new MetaData.AtrInfo("Width",
//    MetaData.SimpleType.int,
//    false,
//    new MetaData.ValLimitForDouble(0,3,3));
//grid.AtrGroup.Set(widthAtr);
//grid.ElmGroupMode = MetaData.ElmGroupMode.Loose;
//grid.ElmGroupType = MetaData.ElmGroupType.Many;
//grid.ElmGroup.Set(control);


//<Grid base="Control">
//    <width type="int" required="true"  min="0" max="3" fraction="3" />
//   <_many>
//        <control type="Controller"/>
//         <grid  type="EasyUIGrid"/>
//    </_many>
//</Grid>*/
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return View;
}(Control));
var EditView = (function (_super) {
    __extends(EditView, _super);
    function EditView(metaData) {
        var _this = _super.call(this) || this;
        _this.MetaData = metaData;
        _this.Build();
        return _this;
    }
    EditView.prototype.GetHtmlInner = function () {
        return "<form></form>";
    };
    EditView.prototype.Build = function () {
        var _this = this;
        var controlGroup = this.MetaData.ToEnumerble()
            .GroupBy(function (item) { return item.Group; })
            .Select(function (item) {
            var group = item.Key() || "基本信息";
            var tableLayout = new GridLayout(2);
            tableLayout.ColWidthGroup = ["65"];
            tableLayout.Height = "";
            for (var _i = 0, _a = item.source; _i < _a.length; _i++) {
                var meta = _a[_i];
                var control = _this.MetaToControl(meta);
                tableLayout.ChildGroup.push(new RawControl(control.Title));
                tableLayout.ChildGroup.push(control);
            }
            return { Group: group, Control: tableLayout };
        })
            .ToList();
        var child = null;
        if (controlGroup.Count() == 1) {
            child = controlGroup.Get(0).Control;
        }
        else if (controlGroup.Count() > 1) {
            var tabs = new TabsLayout();
            child = tabs;
            controlGroup.ToEnumerble().ForEach(function (item) {
                tabs.Add(item.Group, item.Control);
            });
        }
        if (child != null) {
            this.ChildGroup.push(child);
        }
    };
    EditView.prototype.MetaToControl = function (meta) {
        var control;
        if (meta.Type == "string") {
            control = new TextBox();
        }
        else if (meta.Type == "number") {
            control = new NumberBox();
            if (!IsEmpty(meta.Min) && !IsEmpty(meta.Max) && meta.Max - meta.Min <= 100) {
                control = new SliderBox();
            }
        }
        else if (meta.Type == "datetime") {
            control = new DateBox();
        }
        else if (meta.Type == "bool") {
            control = new SwitchBox();
        }
        else if (meta.Type === "enum") {
            var selectBox = new SelectBox();
            control = selectBox;
            setTimeout(function () {
                selectBox.SetData(meta.Data);
            }, 0);
        }
        control.ID = this.ID + "_" + meta.Name;
        for (var name in meta) {
            control[name] = meta[name];
        }
        console.log(control);
        return control;
    };
    return EditView;
}(View));
Panel.prototype.GetHtmlInner = function () {
    return '<div class="easyui-panel"/>';
};
DockLayout.prototype.GetHtmlInner = function () {
    return '<div class="easyui-layout" data-options="fit:true"/>';
};
DockLayout.prototype.GetChildHtml = function (control) {
    var html = control.GetHtml();
    var htmlWrapper = new HtmlWraper(html);
    if (this.Top && control == this.Top) {
        AddEasyUIOption(htmlWrapper, 'region', 'north');
    }
    else if (this.Left && control == this.Left) {
        AddEasyUIOption(htmlWrapper, 'region', 'west');
    }
    else if (this.Center && control == this.Center) {
        AddEasyUIOption(htmlWrapper, 'region', 'center');
    }
    else if (this.Right && control == this.Right) {
        AddEasyUIOption(htmlWrapper, 'region', 'east');
    }
    else if (this.Bottom && control == this.Bottom) {
        AddEasyUIOption(htmlWrapper, 'region', 'south');
    }
    return html;
};
TabsLayout.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = "tabs";
};
TabsLayout.prototype.GetHtmlInner = function () {
    return '<div class="easyui-tabs" data-options="fit:true"></div>"';
};
TabsLayout.prototype.GetChildHtml = function (control) {
    var html = control.GetHtml();
    var layoutInfo = control.TagObj.TabsLayout;
    html = "<div title=\"" + layoutInfo.Title + "\" style=\"padding: 3px\">" + html + "</div>";
    var wraper = new HtmlWraper(html);
    if (!IsEmpty(layoutInfo.Closable)) {
        AddEasyUIOption(wraper, 'closable', layoutInfo.Closable);
    }
    if (!IsEmpty(layoutInfo.Icon)) {
        AddEasyUIOption(wraper, 'iconCls', layoutInfo.Icon);
    }
    return wraper.ToHtml();
};
TabsLayout.prototype.Add = function (title, content, closable, icon) {
    if (closable === void 0) { closable = false; }
    if (icon === void 0) { icon = ""; }
    content.TagObj.TabsLayout = {
        Title: title,
        Closable: closable,
        Icon: icon
    };
    this.ChildGroup.push(content);
    if (this.IsInited) {
        DoEasyUIFun(this, 'add', {
            title: title,
            closable: closable,
            icon: icon,
            content: content.GetHtml()
        });
    }
};
TabsLayout.prototype.Close = function (title) {
    DoEasyUIFun(this, 'close', title);
};
TabsLayout.prototype.Exists = function (title) {
    return DoEasyUIFun(this, 'exists', title);
};
TabsLayout.prototype.Select = function (title) {
    DoEasyUIFun(this, 'select', title);
};
/******************************EditBox******************************/
FormControl.prototype.IncludeHtmlAtrInner = function (htmlWrapper) {
    Control.prototype.IncludeHtmlAtrInner.call(this, htmlWrapper);
    AddEasyUIOption(htmlWrapper, "disabled", !this.Enable);
};
FormControl.prototype.SetEnable = function (isEnable) {
    this.IsEnable = isEnable;
    DoEasyUIFun(this, isEnable ? "enable" : "disable");
};
ValidateBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = "validatebox";
};
ValidateBox.prototype.GetHtmlInner = function () {
    return "<input class=\"easyui-" + this.TagObj.EasyUIType + "\"/>";
};
ValidateBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    FormControl.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);
    AddEasyUIOption(htmlWraper, "required", this.Required);
    AddEasyUIOption(htmlWraper, "editable", this.Editable);
    AddEasyUIOption(htmlWraper, "missingMessage", this.Prompt);
};
ValidateBox.prototype.InitInner = function () {
    var self = this;
    DoEasyUIFun(self, None, {
        onChange: function (newVal) {
            self.OnChange.Do(self, newVal);
        }
    });
};
ValidateBox.prototype.Valid = function () {
    DoEasyUIFun(this, "validate");
};
ValidateBox.prototype.IsValid = function () {
    return DoEasyUIFun(this, "isValid");
};
ValidateBox.prototype.SetEditable = function (isEditable) {
    this.Editable = isEditable;
    DoEasyUIFun(this, "readonly", isEditable);
};
ValidateBox.prototype.GetValue = function () {
    return DoEasyUIFun(this, 'getValue');
    { }
};
ValidateBox.prototype.SetValue = function (val) {
    DoEasyUIFun(this, 'setValue', val);
};
TextBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = 'textbox';
};
TextBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);
    AddEasyUIOption(htmlWraper, "type", this.Type == TextBoxType.Password ? 'password' : 'text');
    AddEasyUIOption(htmlWraper, "multiline", this.Multiline);
};
NumberBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = "numberbox";
};
NumberBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);
    AddEasyUIOption(htmlWraper, "min", this.Min);
    AddEasyUIOption(htmlWraper, "max", this.Max);
    AddEasyUIOption(htmlWraper, "precision", this.Precision);
};
SliderBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = "slider";
};
SliderBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    NumberBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);
    AddEasyUIOption(htmlWraper, "showTip", true);
    AddEasyUIOption(htmlWraper, "range", this.IsRange);
};
DateBox.prototype.SetTag = function (tagObj) {
    var type = '';
    if (this.Mode == DateMode.Date) {
        type = 'datebox';
    }
    else if (this.Mode == DateMode.Time) {
        type = 'timespinner';
    }
    else if (this.Mode == DateMode.DateTime) {
        type = 'datetimebox';
    }
    tagObj.EasyUIType = type;
};
SwitchBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = 'switchbutton';
};
SwitchBox.prototype.GetValue = function () {
    return DoEasyUIFun(this, 'options').checked;
};
SwitchBox.prototype.SetValue = function (val) {
    DoEasyUIFun(this, val ? "check" : "uncheck");
};
SelectBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = this.Multiple ? "tagbox" : "combobox";
};
SelectBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);
    AddEasyUIOption(htmlWraper, "hasDownArrow", true);
    AddEasyUIOption(htmlWraper, "valueField", this.ValueField);
    AddEasyUIOption(htmlWraper, "textField", this.TextField);
    AddEasyUIOption(htmlWraper, "multiple", this.Multiple);
};
SelectBox.prototype.InitInner = function () {
    var self = this;
    DoEasyUIFun(self, None, {
        onChange: function (newVal) {
            self.OnChange.Do(self, newVal);
        },
        onSelect: function (item) {
            self.OnSelect.Do(self, item);
        }
    });
};
SelectBox.prototype.GetData = function () {
    return DoEasyUIFun(this, "getData");
};
SelectBox.prototype.SetData = function (data) {
    DoEasyUIFun(this, "loadData", data);
};
/******************************CommonFunc******************************/
function AddEasyUIOption(htmlWrapper, name, val) {
    if (!IsEmpty(val)) {
        //转换成Jquery对象
        var keyValue = name + ":" + ToValueStr(val, "'");
        //设置EasyUI属性
        var option = htmlWrapper.GetAtr('data-options');
        option = option ? option + "," + keyValue : keyValue;
        htmlWrapper.SetAtr('data-options', option);
    }
}
function DoEasyUIFun(control, funName) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var elm = $('#' + control.ID);
    var easyUIElm = elm[control.TagObj.EasyUIType];
    if (!HasEasyUIFunc(control, funName)) {
        //对于不可编辑的元素,改变Enable状态
        if (funName == "readonly") {
            funName = args[0] ? "disable" : "enable";
        }
    }
    if (IsEmpty(funName)) {
        return easyUIElm.apply(elm, args);
    }
    else if (HasEasyUIFunc(control, funName)) {
        var callArgs = [funName].concat(args);
        return easyUIElm.apply(elm, callArgs);
    }
    else {
        return None;
    }
}
function HasEasyUIFunc(control, funName) {
    var classGroup = $('#' + control.ID).attr('class').split(' ');
    var typeGroup = $.Enumerable.From(classGroup)
        .Where(function (item) { return item.indexOf('-f') >= 0; })
        .Select(function (item) { return item.substr(0, item.indexOf('-f')); })
        .ToArray();
    var exsit = $.Enumerable.From(typeGroup)
        .Any(function (item) { return $.fn[item].methods[funName]; });
    return exsit;
}

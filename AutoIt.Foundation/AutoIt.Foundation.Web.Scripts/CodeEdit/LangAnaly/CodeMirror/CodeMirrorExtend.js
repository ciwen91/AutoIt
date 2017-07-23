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

﻿(<any>CodeMirror).defaults.EditorID = null;

//CodeMirror扩展类
class CodeMirrorExtend {
    //编辑器ID
    private _EditorID: string;
    //分析过的文本
    private _AnalyedText: string = null;
    //分析器
    private _LangAnaly: CodeEdit.LangAnaly.LangAnalyBase;
    //样式函数
    StyleFunc:FuncOne<CodeEdit.LangAnaly.Model.GramerAnalyInfo,string>=null;

    //编辑器的全局键,语法元数据地址,内容元素名称列表
    constructor(editorID: string,
        egtUrl: string,
        contentNameGroup: List<string> = new List<string>()) {
        //记录编辑器ID
        this._EditorID = editorID;

        //创建分析器
        var egt = getAjaxData(egtUrl);
        var analy = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
        analy.ContentNameGroup = contentNameGroup;

        this._LangAnaly = analy;
    }

    //创建编辑器(Html元素,配置)
    static CreateEditor(elm: HTMLTextAreaElement, option: CodeMirror.EditorConfiguration): CodeMirror.EditorConfiguration {
        //设置编辑器ID
        var editorID = Math.random();
        (<any>option).EditorID = editorID;

        //创建编辑器
        var editor = CodeMirror.fromTextArea(elm, option);
        window[editorID] = <any>editor;

        return editor;
    }

    //高亮文本
    HighLight(stream: CodeMirror.StringStream, state: any):string {
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
    }

    //更新分析器(如果文本变化重新分析)
    UpdateAnalyzer() {
        var editor = Cast<CodeMirror.EditorFromTextArea>(window[this._EditorID]);

        var text = editor.getValue();
        //CodeMirror从首个非空白行开始处理
        text = text.replace(/^\n/mg, "");

        //文本变化则重新分析
        if (this._AnalyedText != text) {
            this._LangAnaly.Analy(text);
            this._AnalyedText = text;
        }
    }

    //消耗语法
    ConsumeAnalyInfo(stream: CodeMirror.StringStream,
        gramerInfo: CodeEdit.LangAnaly.Model.GramerInfo,
        line: number,
        col: number) {
        //如果语法为空,则消耗当前字符
        if (gramerInfo == null) {
            stream.next();
        }
        //语法不为空,则消耗语法的字符
        else {
            var endPoint = gramerInfo.EndLinePoint();
            var tempCol = col;
            while (!stream.eol() && (line < endPoint.Y || tempCol <= endPoint.X)) {
                stream.next();
                tempCol++;
            }
        }
    }

    //获取样式
    GetStyle(gramerAnalyInfo: CodeEdit.LangAnaly.Model.GramerAnalyInfo): string {
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
        } else {
            return null;
        }
    }
}
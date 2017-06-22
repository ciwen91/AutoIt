(<any>CodeMirror).defaults.EditorKey = null;

class CodeMirrorExtend {
    private _EditorKey: string;
    private _AnalyedText: string = null;
    private _LangAnaly: CodeEdit.LangAnaly.LangAnalyBase;
    StyleFunc:FuncOne<CodeEdit.LangAnaly.Model.GramerAnalyInfo,string>=null;

    constructor(editorKey: string,egtUrl:string) {
        this._EditorKey = editorKey;

        var egt = getAjaxData(egtUrl);
        var manger = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
        manger.ContentNameGroup = $.Enumerable.From(["Text"]).ToList();
        this._LangAnaly = manger;
    }

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
        var editor = Cast<CodeMirror.EditorFromTextArea>(window[this._EditorKey]);

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
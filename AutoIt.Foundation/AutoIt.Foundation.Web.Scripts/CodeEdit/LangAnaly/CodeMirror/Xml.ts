//xml Mode
CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;
    var val: string = null;
    var manger: CodeEdit.LangAnaly.Lang.PrintLangManager = null;

    $.get("data/xml.egt.base64",
        egtBase64 => {
            var egt = base64ToBin(egtBase64);
            manger = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
            manger.ContentNameGroup = $.Enumerable.From(["Text"]).ToList();//???
        });

    function UpdateAnalyzer() {
        var editor = Cast<CodeMirror.EditorFromTextArea>(window[editorKey]);

        var xml = editor.getValue();
        xml = xml.replace(/^\n/mg, "");

        if (xml != val) {
            manger.Analy(xml);
            val = xml;
        }
    }

    function ConsumeAnalyInfo(stream: CodeMirror.StringStream,
        gramerInfo: CodeEdit.LangAnaly.Model.GramerInfo,
        line: number,
        col: number) {
        //如果语法为空,则处理下一个字符
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

    function GetStyle(gramerAnalyInfo: CodeEdit.LangAnaly.Model.GramerAnalyInfo): string {
        var gramerInfo =gramerAnalyInfo==null?null:gramerAnalyInfo.GramerInfo;

        if (gramerInfo == null) {
            return null;
        }

        if (gramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.Error) {
            return "error";
        }

        if (gramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.AutoComplete) {
            var nextPoint = gramerInfo.NextPoint(val);
            var nextAnalyInfo = manger.GetAnalyInfo(nextPoint.Y, nextPoint.X);

            var isNextError = nextAnalyInfo != null &&
                nextAnalyInfo.GramerInfo != null &&
                nextAnalyInfo.GramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.Error;
            if (!isNextError) {
                return "error";
            }
        }

        var style = null;
        var name = gramerInfo.Symbol.Name;
        var parentMaySymbolGroup = gramerAnalyInfo.ParantMaySymbolGroup.ToEnumerble()
            .Select(item => item.Name);

        //标签括号
        if (name == "<" || name == ">" || name == "</" || name == "/>") {
            style = "tag bracket";
        }
        //标签名或属性名
        else if (name == "Name") {
            //标签:父节点为标签
            if (parentMaySymbolGroup.Any(item => item.indexOf("Tag") >= 0)) {
                style = "tag";
            }
            //属性:父节点为属性
            else if (parentMaySymbolGroup.Contains("Attribute")) {
                style = "attribute";
            }
        }
        //属性值
        else if (name == "Val") {
            style = "string";
        }
        //内容文本
        else if (name == "Text") {
            style = "emstrong";
        }

        return style;
    }


    return {
        startState: () => {
            //起始位-1行
            return {
                Line: -1
            };
        },
        token: (stream, state) => {
            //获取当前位置.如果是第一列,则行加1
            if (stream.pos == 0) {
                state.Line += 1;
            }
            var line = state.Line;
            var col = stream.pos;

            //更新分析器(文本可能有变化)
            UpdateAnalyzer();         
           
            //获取当前位置的语法
            var gramerAnalyInfo = manger.GetAnalyInfo(line, col);
            var gramerInfo = gramerAnalyInfo == null ? null : gramerAnalyInfo.GramerInfo;

            //消耗语法
            ConsumeAnalyInfo(stream, gramerInfo, line, col);

            //获取Style
            var style = GetStyle(gramerAnalyInfo);

            return style;
        }   
    };
});

var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");

function base64ToBin(str) {
    var bitString = "";
    var tail = 0;
    for (var i = 0; i < str.length; i++) {
        if (str[i] != "=") {
            var decode = code.indexOf(str[i]).toString(2);
            bitString += (new Array(7 - decode.length)).join("0") + decode;
        } else {
            tail++;
        }
    }
    return bitString.substr(0, bitString.length - tail * 2);
}


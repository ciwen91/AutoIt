CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;

    var val: string = null;
    var manger: CodeEdit.LangAnaly.Lang.PrintLangManager = null;

    $.get("data/xml.egt.base64",
        egtBase64 => {
            var egt = base64ToBin(egtBase64);
            manger = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
            manger.ContentNameGroup = $.Enumerable.From(["Content"]).ToList();
        });

    return {
        startState: () => {
            return { Line: -1 };
        },
        /**
          跨行如何处理？
         */
        token: (stream, state) => {
            var editor = Cast<CodeMirror.EditorFromTextArea>(window[editorKey]);
            var xml = editor.getValue();
            if (xml != val) {

                manger.Analy(xml);
                val = xml;
                console.clear();
            }
            if (stream.pos == 0) {
                state.Line += 1;
            }
            var line = state.Line;
            var col = stream.pos;

            var gramerAnalyInfo = manger.GetGramerAnalyInfo(line, col);
            var gramerInfo = gramerAnalyInfo == null ? null : gramerAnalyInfo.GramerInfo;
          
            if (gramerInfo == null) {
                stream.next();
                return null;
            } else {
                for (var i = 0; i < gramerInfo.Value.length; i++) {
                    stream.next();
                }
            }
            //while (!stream.eol()) {

            //}
          
            if (gramerInfo.GramerState == CodeEdit.LangAnaly.Model.GramerInfoState.Error) {
                return "error";
            }

            //console.log(gramerInfo);
            //console.log(gramerAnalyInfo.ParantMaySymbolGroup);

            var name = gramerInfo.Symbol.Name;
            var parentMaySymbolGroup = $.Enumerable.From(gramerAnalyInfo.ParantMaySymbolGroup.ToArray())
                .Select(item => item.Name)
                .ToList();

            var style = null;

          

            if (name == "<" || name == ">" || name == "</"|| name == "/>" ) {
                style= "tag bracket";
            } else if(name=="Val") {
                style = "string";
            } else if (name == "Name") {
                if ($.Enumerable.From(parentMaySymbolGroup.ToArray()).Any(item => item.indexOf("Tag") >= 0)) {
                    style = "tag";
                } else if (parentMaySymbolGroup.Contains("Attribute")) {
                    style = "attribute";
                }
            }

            console.log(style);
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


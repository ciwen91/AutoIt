CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;

    var val: string = null;
    var manger: CodeEdit.LangAnaly.Lang.PrintLangManager = null;

    $.get("data/xml.egt.base64",
        egtBase64 => {
            var egt = base64ToBin(egtBase64);
            manger = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
            manger.ContentNameGroup = $.Enumerable.From(["Word", "Text", "Content"]).ToList();
        });

    return {
        startState: () => {
            return { Line: -1 };
        },
        token: (stream, state) => {
            var editor = Cast<CodeMirror.EditorFromTextArea>(window[editorKey]);
            var xml = editor.getValue();
            if (xml != val) {
                manger.Analy(xml);
            }

            if (stream.start == 0) {
                state.Line += 1;
            }
            var line = state.Line;
            var col = stream.start;
            var gramerInfo= manger.GetGramerInfo(line, col);
            console.log(gramerInfo);

            while (!stream.eol()) {
                stream.next();
            }

            return "tag";
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


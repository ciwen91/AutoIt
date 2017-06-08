CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;
  
    return {
        startState: () => {
            return { Line: -1 };
        },
        token: (stream, state) => {
            var editor = Cast<CodeMirror.EditorFromTextArea>(window[editorKey]);
           
            while (!stream.eol()) {
                stream.next();
            }

            $.get("data/xml.egt.base64",
                function (egt) {                    
                    var xml = editor.getValue();
                    egt = base64ToBin(egt);

                    var manager = new CodeEdit.LangAnaly.Lang.PrintLangManager(egt);
                    manager.ContentNameGroup = $.Enumerable.From(["Word", "Text", "Content"]).ToList();
                    console.clear();
                    var result = manager.Analy(xml);
                    console.log(result);
                });
        
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


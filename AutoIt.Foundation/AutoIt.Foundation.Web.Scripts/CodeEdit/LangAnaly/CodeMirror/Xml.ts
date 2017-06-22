//xml Mode
CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;
    var extend = new CodeMirrorExtend(editorKey, "data/xml.egt.base64");

    return {
        startState: () => {
            //起始位-1行
            return {
                Line: -1
            };
        },
        token: (stream, state) => {
            return extend.HighLight(stream, state);
        }   
    };
});






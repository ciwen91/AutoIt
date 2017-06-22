(<any>CodeMirror).defineMIME("text/xml", "xml");

//xml Mode
CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorKey = (<any>editorConfig).EditorKey;
    //创建扩展类型
    var extend = new CodeMirrorExtend(editorKey, "data/xml.egt.base64");
    extend.StyleFunc= (analyInfo) => {
        var style = null;
        var gramerInfo = analyInfo.GramerInfo;

        var name = gramerInfo.Symbol.Name;
        var parentMaySymbolGroup = analyInfo.ParantMaySymbolGroup.ToEnumerble()
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
            //调用扩展类的高亮方法
            return extend.HighLight(stream, state);
        }   
    };
});






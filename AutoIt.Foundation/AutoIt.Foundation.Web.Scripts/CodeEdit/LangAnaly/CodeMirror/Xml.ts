(<any>CodeMirror).defineMIME("text/xml", "xml");

//xml Mode
CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorID = (<any>editorConfig).EditorID;

    //创建扩展类型
    var extend = new CodeMirrorExtend(editorID, "data/xml.egt.base64", new List<string>(["Text"]));

    //样式函数
    extend.StyleFunc= (analyInfo) => {
        var style = null;

        //获取语法和可能的父符号名称
        var gramerInfo = analyInfo.GramerInfo;
        var name = gramerInfo.Symbol.Name;
        var parentMayNameGroup = analyInfo.ParantMaySymbolGroup.ToEnumerble()
            .Select(item => item.Name);

        //尖括号
        if (name == "<" || name == ">" || name == "</" || name == "/>") {
            style = "tag bracket";
        }
        //名称
        else if (name == "Name") {
            //标签名(父节点为标签)
            if (parentMayNameGroup.Any(item => item.indexOf("Tag") >= 0)) {
                style = "tag";
            }
            //属性名(父节点为属性)
            else if (parentMayNameGroup.Contains("Attribute")) {
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






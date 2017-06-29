(<any>CodeMirror).defineMIME("text/xml", "xml");

//xml Mode
CodeMirror.defineMode("xml", (editorConfig, config) => {
    var editorID = (<any>editorConfig).EditorID;

    //创建扩展类型
    var extend = new CodeMirrorExtend(editorID,
        "data/xml.egt.base64",
        new List<string>(["Text"]),
        new List<string>(["<"]));

    //样式函数
    extend.StyleFunc = (analyInfo) => {
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
            if (parentMayNameGroup.Count() > 0 && parentMayNameGroup.ElementAt(0).indexOf("Tag") >= 0) {
                style = "tag";
            }
            //属性名(父节点为属性)
            else if (parentMayNameGroup.Count() > 0 && parentMayNameGroup.ElementAt(0).indexOf("Attribute") >= 0) {
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


CodeMirror.defineOption("autoTag",
    true,
    function (cm, val, old) {
        var map = {};
        map["'>'"] = function (cm) {
            var extend = <CodeMirrorExtend>cm.Extend;
            var analy = extend._LangAnaly;
           
            var ranges = cm.listSelections();
            for (var i = 0; i < ranges.length; i++) {
                var range = ranges[i];
               
                setTimeout(function () {
                    var gramerReader = analy._GramerReader;
                    var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
                    if (info.ParantMaySymbolGroup.Count() > 0 && info.ParantMaySymbolGroup.Get(0).Name == "Start Tag") {
                        var nameGramer = gramerReader
                            .GetClosetGrammer(item => item.Symbol.Name == "Name" &&
                                gramerReader.GetParentMaySymbolGroup(item)
                                .ToEnumerble()
                                .Any(sItem => sItem.Name.indexOf("Tag") >= 0),
                                info.GramerInfo);
                        var tag = nameGramer.Value;

                        range.anchor.ch++;
                        cm.replaceRange(">\n\n</" + tag + ">", range.head, range.anchor, "+insert");

                        // debugger;
                        cm.indentLine(range.head.line + 1, "prev", true);
                        cm.indentLine(range.head.line + 1, "add", true);
                        cm.indentLine(range.head.line + 2, "prev", true);
                        cm.indentLine(range.head.line + 2, "subtract", true);
                        var newPos = CodeMirror.Pos(range.head.line + 1, cm.getLine(range.head.line + 1).length);
                        cm.setSelections([{ head: newPos, anchor: newPos }]);

                    }
                }, 0);
            }

         

            return CodeMirror.Pass;
        }

        map["'\"'"] = function (cm) {
            var extend = <CodeMirrorExtend>cm.Extend;
            var analy = extend._LangAnaly;
            var range = cm.listSelections()[0];

            setTimeout(function() {
                    var gramerReader = analy._GramerReader;
                    var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
                    console.log(info);

                    if (info.ParantMaySymbolGroup.Count() > 0 &&
                        info.ParantMaySymbolGroup.Get(0).Name == "Val" &&
                        info.ParantMaySymbolGroup.ToEnumerble().Any(item => item.Name == "Attribute")) {
                        cm.replaceRange('"', range.head, range.anchor);
                        var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                        cm.setSelections([{ head: newPos, anchor: newPos }]);
                    }
                },
                0);

            return CodeMirror.Pass;
        }

        cm.addKeyMap(map);
    });





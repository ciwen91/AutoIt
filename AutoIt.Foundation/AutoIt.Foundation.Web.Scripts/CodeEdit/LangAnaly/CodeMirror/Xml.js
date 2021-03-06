CodeMirror.defineMIME("text/xml", "xml");
//xml Mode
CodeMirror.defineMode("xml", function (editorConfig, config) {
    var editorID = editorConfig.EditorID;
    //创建扩展类型
    var extend = new CodeMirrorExtend(editorID, "data/xml.egt.base64", new List(["Text"]), new List(["<"]));
    //样式函数
    extend.StyleFunc = function (analyInfo) {
        var style = null;
        //获取语法和可能的父符号名称
        var gramerInfo = analyInfo.GramerInfo;
        var name = gramerInfo.Symbol.Name;
        var parentMayNameGroup = analyInfo.ParantMaySymbolGroup.ToEnumerble()
            .Select(function (item) { return item.Name; });
        var firstParentName = parentMayNameGroup.FirstOrDefault("");
        //尖括号
        if (name == "<" || name == ">" || name == "</" || name == "/>") {
            style = "tag bracket";
        }
        else if (name == "Name") {
            //标签名(父节点为标签)
            if (firstParentName.indexOf("Tag") >= 0) {
                style = "tag";
            }
            else if (firstParentName.indexOf("Attribute") >= 0) {
                style = "attribute";
            }
        }
        else if (name == "Val") {
            style = "string";
        }
        else if (name == "Text") {
            style = "emstrong";
        }
        return style;
    };
    return {
        startState: function () {
            //起始位-1行
            return {
                Line: -1
            };
        },
        token: function (stream, state) {
            //调用扩展类的高亮方法
            return extend.HighLight(stream, state);
        }
    };
});
CodeMirror.defineOption("autoTag", true, function (cm, val, old) {
    var map = {};
    map["'>'"] = function (cm) {
        var extend = cm.Extend;
        var analy = extend._LangAnaly;
        var ranges = cm.listSelections();
        if (ranges.length > 0) {
            var range = ranges[0];
            setTimeout(function () {
                var gramerReader = analy._GramerReader;
                var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
                if (info.ParantMaySymbolGroup.Count() > 0 &&
                    info.ParantMaySymbolGroup.Get(0).Name == "Start Tag") {
                    var nameGramer = gramerReader
                        .GetClosetGrammer(function (item) { return item.Symbol.Name == "Name" &&
                        item.GetParentMaySymbolGroup()
                            .ToEnumerble()
                            .Any(function (sItem) { return sItem.Name.indexOf("Tag") >= 0; }); }, info.GramerInfo);
                    var tag = nameGramer.Value;
                    var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                    cm.replaceRange("\n\n</" + tag + ">", newPos, newPos);
                    //比上一行多一层缩进
                    cm.indentLine(range.head.line + 1, "prev", true);
                    cm.indentLine(range.head.line + 1, "add", true);
                    //比上一行少一层缩进
                    cm.indentLine(range.head.line + 2, "prev", true);
                    cm.indentLine(range.head.line + 2, "subtract", true);
                    //定位到中间行的尾部
                    newPos = CodeMirror.Pos(range.head.line + 1, cm.getLine(range.head.line + 1).length);
                    cm.setSelections([{ head: newPos, anchor: newPos }]);
                }
            }, 0);
        }
        return CodeMirror.Pass;
    };
    map["'\"'"] = function (cm) {
        var extend = cm.Extend;
        var analy = extend._LangAnaly;
        var range = cm.listSelections()[0];
        setTimeout(function () {
            var info = analy.GetAnalyInfo(range.head.line, range.head.ch);
            console.log(info);
            if (info.ParantMaySymbolGroup.Count() > 0 &&
                info.ParantMaySymbolGroup.Get(0).Name == "Val" &&
                info.ParantMaySymbolGroup.ToEnumerble().Any(function (item) { return item.Name == "Attribute"; })) {
                var newPos = CodeMirror.Pos(range.head.line, range.head.ch + 1);
                cm.replaceRange('"', newPos, newPos);
                cm.setSelections([{ head: newPos, anchor: newPos }]);
            }
        }, 0);
        return CodeMirror.Pass;
    };
    cm.addKeyMap(map);
});
CodeMirror.registerHelper("hint", "xml", function (cm, options) {
    var cur = cm.getCursor();
    var extend = cm.Extend;
    var analy = extend._LangAnaly;
    var analyInfo = analy.GetAnalyInfo(cur.line, cur.ch);
    console.log(analyInfo);
    return {
        list: ["abc", "123", "中文"],
        from: cur,
        to: cur
    };
});

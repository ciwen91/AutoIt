var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var EgtManager = (function () {
            function EgtManager() {
                this.CharSetGroup = new List();
                this.SymbolGroup = new List();
                this.GroupGroup = new List();
                this.ProduceGroup = new List();
                this.DFAStateGroup = new List();
                this.LALRStateGroup = new List();
                //#endregion
            }
            EgtManager.CreateFromStr = function (str) {
                Context.Do(function () {
                    var manager = new EgtManager();
                });
            };
            //#region Base
            EgtManager.prototype.ReadEntity = function (stream) {
                var type = this.ReadNum(stream, 1);
                if (type == 69) {
                    return null;
                }
                else if (type == 98) {
                    return this.ReadNum(stream, 1);
                }
                else if (type == 66) {
                    return this.ReadNum(stream, 1) == 1;
                }
                else if (type == 73) {
                    return this.ReadNum(stream, 2);
                }
                else if (type == 83) {
                    return this.ReadString(stream);
                }
                else {
                    throw "Unkonw Type!";
                }
            };
            EgtManager.prototype.ReadString = function (stream) {
                var str = "";
                while (true) {
                    var num = this.ReadNum(stream, 2);
                    if (num > 0) {
                        str += num.toString(); //??? ToChar
                    }
                    else {
                        break;
                    }
                }
                return str;
            };
            EgtManager.prototype.ReadNum = function (stream, digits) {
                var num = 0;
                for (var i = 0; i < digits; i++) {
                    num += stream.ReadByte() << (i * 8);
                }
                return num;
            };
            return EgtManager;
        }());
        LangAnaly.EgtManager = EgtManager;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=EgtManager.js.map
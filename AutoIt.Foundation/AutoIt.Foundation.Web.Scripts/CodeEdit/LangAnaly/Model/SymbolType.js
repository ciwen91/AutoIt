var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var SymbolType;
            (function (SymbolType) {
                SymbolType[SymbolType["Nonterminal"] = 0] = "Nonterminal";
                SymbolType[SymbolType["Terminal"] = 1] = "Terminal";
                SymbolType[SymbolType["Noise"] = 2] = "Noise";
                SymbolType[SymbolType["EndofFile"] = 3] = "EndofFile";
                SymbolType[SymbolType["GroupStart"] = 4] = "GroupStart";
                SymbolType[SymbolType["GroundEnd"] = 5] = "GroundEnd";
                SymbolType[SymbolType["Error"] = 7] = "Error";
            })(SymbolType = Model.SymbolType || (Model.SymbolType = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=SymbolType.js.map
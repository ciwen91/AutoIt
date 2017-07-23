var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //��������
            var SymbolType;
            (function (SymbolType) {
                //���ս��
                SymbolType[SymbolType["Nonterminal"] = 0] = "Nonterminal";
                //�ս��
                SymbolType[SymbolType["Terminal"] = 1] = "Terminal";
                //�ɺ��Եķ���
                SymbolType[SymbolType["Noise"] = 2] = "Noise";
                //�ı�ĩβ
                SymbolType[SymbolType["EndofFile"] = 3] = "EndofFile";
                //���鿪ʼ
                SymbolType[SymbolType["GroupStart"] = 4] = "GroupStart";
                //����ĩβ
                SymbolType[SymbolType["GroundEnd"] = 5] = "GroundEnd";
                //����
                SymbolType[SymbolType["Error"] = 7] = "Error";
            })(SymbolType = Model.SymbolType || (Model.SymbolType = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

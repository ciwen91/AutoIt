var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //DFA��
            var DFAEdge = (function () {
                function DFAEdge() {
                }
                //�ַ��Ƿ��ڱ���
                DFAEdge.prototype.IsFit = function (cha) {
                    var code = cha.charCodeAt(0);
                    return $.Enumerable.From(this.CharSet.Group.ToArray()).Any(function (item) { return code >= item.Start && code <= item.End; });
                };
                return DFAEdge;
            }());
            Model.DFAEdge = DFAEdge;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

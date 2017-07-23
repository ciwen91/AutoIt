var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //������Ϣ����
            var SymbolInfoBase = (function () {
                function SymbolInfoBase(symbol, value, line, col, index) {
                    this.Symbol = symbol;
                    this.Value = value;
                    this.Line = line;
                    this.Col = col;
                    this.Index = index;
                }
                SymbolInfoBase.prototype.Contains = function (line, col) {
                    var startPoint = this.StartLintPoint();
                    var endPoint = this.EndLinePoint();
                    var curPoint = new LinePoint(-1, col, line);
                    return curPoint.Compare(startPoint) >= 0 && curPoint.Compare(endPoint) <= 0;
                };
                //��ʼλ��
                SymbolInfoBase.prototype.StartLintPoint = function () {
                    return new LinePoint(this.Index, this.Col, this.Line);
                };
                //����λ��
                SymbolInfoBase.prototype.EndLinePoint = function () {
                    var point = this.Value.NextPoint(LinePoint.Empty, this.Value.length - 1);
                    var endPoint = this.StartLintPoint().Add(point);
                    return endPoint;
                };
                return SymbolInfoBase;
            }());
            Model.SymbolInfoBase = SymbolInfoBase;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

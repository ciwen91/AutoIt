var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //语法分析信息
            var GramerAnalyInfo = (function () {
                function GramerAnalyInfo(gramerInfo) {
                    this.GramerInfo = gramerInfo;
                    this.ParantMaySymbolGroup = gramerInfo.GetParentMaySymbolGroup();
                }
                return GramerAnalyInfo;
            }());
            Model.GramerAnalyInfo = GramerAnalyInfo;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var GramerInfoState;
            (function (GramerInfoState) {
                GramerInfoState[GramerInfoState["Shift"] = 0] = "Shift";
                GramerInfoState[GramerInfoState["Reduce"] = 1] = "Reduce";
                GramerInfoState[GramerInfoState["Accept"] = 2] = "Accept";
                GramerInfoState[GramerInfoState["Error"] = 3] = "Error";
            })(GramerInfoState = Model.GramerInfoState || (Model.GramerInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));
//# sourceMappingURL=GramerInfoState.js.map
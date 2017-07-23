var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            var TokenInfoState;
            (function (TokenInfoState) {
                //����
                TokenInfoState[TokenInfoState["Accept"] = 0] = "Accept";
                //����
                TokenInfoState[TokenInfoState["Error"] = 1] = "Error";
                //����
                TokenInfoState[TokenInfoState["End"] = 2] = "End";
            })(TokenInfoState = Model.TokenInfoState || (Model.TokenInfoState = {}));
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

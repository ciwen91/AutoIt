module CodeEdit.LangAnaly.Model {
    export  class  GramerInfo extends  CodeEdit.LangAnaly.Model.SymbolInfoBase {
        GramerState: CodeEdit.LangAnaly.Model.GramerInfoState;
        StartToken: CodeEdit.LangAnaly.Model.TokenInfo;
        Produce: CodeEdit.LangAnaly.Model.Produce;

        Parent: GramerInfo;
        private _ChildGroup: List<GramerInfo> = new List<GramerInfo>();

        GetLevel():number {
            if (this.Produce == null) {
                return -1;
            }
            else if (this._ChildGroup.Count() == 0) {
                return 0;
            } else {
                return  $.Enumerable.From(this._ChildGroup.ToArray()).Max(item => item.GetLevel() + 1);
            }
        }
    }
}
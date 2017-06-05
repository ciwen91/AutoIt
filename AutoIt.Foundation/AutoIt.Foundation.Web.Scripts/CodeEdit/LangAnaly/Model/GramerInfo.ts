///<reference path="SymbolInfoBase.ts"/>>
module CodeEdit.LangAnaly.Model {
    export  class  GramerInfo extends  CodeEdit.LangAnaly.Model.SymbolInfoBase {
        GramerState: CodeEdit.LangAnaly.Model.GramerInfoState;
        StartToken: CodeEdit.LangAnaly.Model.TokenInfo;
        Produce: CodeEdit.LangAnaly.Model.Produce;

        Parent: GramerInfo;
        private _ChildGroup: List<GramerInfo> = new List<GramerInfo>();

        SetChildGroup(childGroup: List<GramerInfo>){
            this._ChildGroup = childGroup;
            $.each(this._ChildGroup.ToArray(), (i, item) => item.Parent = this);
        }
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

       

        constructor(gramerState: GramerInfoState, startToken: TokenInfo) {
            super(startToken.Symbol, startToken.Value, startToken.Line, startToken.Col, startToken.Index);

            this.GramerState = gramerState;
            this.StartToken = startToken;
            this.Data = startToken.Data;
        }
    }
}
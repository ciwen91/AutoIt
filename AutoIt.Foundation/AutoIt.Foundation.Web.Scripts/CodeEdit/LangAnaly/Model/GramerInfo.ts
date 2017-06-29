///<reference path="SymbolInfoBase.ts"/>>
module CodeEdit.LangAnaly.Model {
    //语法信息
    export  class  GramerInfo extends  CodeEdit.LangAnaly.Model.SymbolInfoBase {
        //语法状态
        GramerState: CodeEdit.LangAnaly.Model.GramerInfoState;
        //起始记号
        StartToken: CodeEdit.LangAnaly.Model.TokenInfo;
        //产生式
        Produce: CodeEdit.LangAnaly.Model.Produce=null;

        //父语法
        Parent: GramerInfo;
        //子语法集合
        private _ChildGroup: List<GramerInfo> = new List<GramerInfo>();

        public MayParent: GramerInfo = null;
        public MayParentSymbolGroup:List<Model.Symbol>=new List<Model.Symbol>();

        constructor(gramerState: GramerInfoState, startToken: TokenInfo) {
            super(startToken.Symbol, startToken.Value, startToken.Line, startToken.Col, startToken.Index);

            this.GramerState = gramerState;
            this.StartToken = startToken;
            this.Data = startToken.Data;
        }

        //获取子语法
        GetChildGroup(): List<GramerInfo> {
            return this._ChildGroup;
        }
        //设置子语法
        SetChildGroup(childGroup: List<GramerInfo>){
            this._ChildGroup = childGroup;
            this._ChildGroup.ToEnumerble()
                .ForEach(item => item.Parent = this);
        }
        //获取语法层级
        GetLevel():number {
            if (this.Produce == null) {
                return -1;
            }
            else if (this._ChildGroup.Count() == 0) {
                return 0;
            } else {
                return this._ChildGroup.ToEnumerble().Max(item => item.GetLevel() + 1);
            }
        }
        //下一个位置(字符串)
        NextPoint(val:string): LinePoint {
            var nextPoint = val.NextPoint(this.EndLinePoint(), 1);
            return nextPoint;
        }
    }
}
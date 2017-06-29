///<reference path="SymbolInfoBase.ts"/>>
module CodeEdit.LangAnaly.Model {
    //�﷨��Ϣ
    export  class  GramerInfo extends  CodeEdit.LangAnaly.Model.SymbolInfoBase {
        //�﷨״̬
        GramerState: CodeEdit.LangAnaly.Model.GramerInfoState;
        //��ʼ�Ǻ�
        StartToken: CodeEdit.LangAnaly.Model.TokenInfo;
        //����ʽ
        Produce: CodeEdit.LangAnaly.Model.Produce=null;

        //���﷨
        Parent: GramerInfo;
        //���﷨����
        private _ChildGroup: List<GramerInfo> = new List<GramerInfo>();

        public MayParent: GramerInfo = null;
        public MayParentSymbolGroup:List<Model.Symbol>=new List<Model.Symbol>();

        constructor(gramerState: GramerInfoState, startToken: TokenInfo) {
            super(startToken.Symbol, startToken.Value, startToken.Line, startToken.Col, startToken.Index);

            this.GramerState = gramerState;
            this.StartToken = startToken;
            this.Data = startToken.Data;
        }

        //��ȡ���﷨
        GetChildGroup(): List<GramerInfo> {
            return this._ChildGroup;
        }
        //�������﷨
        SetChildGroup(childGroup: List<GramerInfo>){
            this._ChildGroup = childGroup;
            this._ChildGroup.ToEnumerble()
                .ForEach(item => item.Parent = this);
        }
        //��ȡ�﷨�㼶
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
        //��һ��λ��(�ַ���)
        NextPoint(val:string): LinePoint {
            var nextPoint = val.NextPoint(this.EndLinePoint(), 1);
            return nextPoint;
        }
    }
}
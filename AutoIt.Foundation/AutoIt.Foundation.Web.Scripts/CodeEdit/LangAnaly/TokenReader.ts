module CodeEdit.LangAnaly {
    //从字符串中读取记号
    export class TokenReader {
        //Egt信息
        private _Egt: EgtStorer;
        //被读取的字符串
        private _Str: string;

        //当前索引
        private _Index: number = 0;
        //当前行
        private _Line: number = 0;
        //当前列
        private _Col: number = 0;

        constructor(egt: EgtStorer, str: string) {
            this._Egt = egt;
            this._Str = str;
        }

        //读取记号
        ReadToken(): Model.TokenInfo {
            //如果已读到字符串末尾就返回EndOfFile记号
            if (this._Index == this._Str.length) {
                var endSymbol = this._Egt.SymbolGroup.ToEnumerble()
                    .First(item => item.Type == Model.SymbolType.EndofFile);

                return new Model.TokenInfo(Model.TokenInfoState.End,
                    endSymbol,
                    null,
                    this._Index,
                    this._Line,
                    this._Col);
            }

            var index = this._Index;
            var startIndex = index;

            //开始状态
            var state = this._Egt.DFAStateGroup.Get(0);
            //接受记号
            var acceptSymbol: Model.Symbol = null;
            //接受索引
            var accpetIndex = -1;

            while (true) {
                var edge: Model.DFAEdge = null;

                //
                if (index <= this._Str.length - 1) {
                    var cha = this._Str[index];
                    edge = state.GetEdge(cha);
                }

                //如果边不为空
                if (edge != null) {
                    //切换到目标状态
                    state = edge.TargetState;

                    //记录可接受的标记
                    if (state.AcceptSymbol != null) {
                        acceptSymbol = state.AcceptSymbol;
                        accpetIndex = index;
                    }

                    index++;
                } else {
                    //如果有接受标记,则返回接受标记
                    if (acceptSymbol != null) {
                        var token = new Model.TokenInfo(Model.TokenInfoState.Accept,
                            acceptSymbol,
                            this._Str.substr(startIndex, accpetIndex - startIndex + 1),
                            this._Index,
                            this._Line,
                            this._Col);
                        //消耗标记文本
                        this.Consumn(token.Value);
                        return token;
                    } else {
                        //如果没有接受标记,则返回错误标记
                        var token = new Model.TokenInfo(Model.TokenInfoState.Error,
                            null,
                            this._Str[startIndex].toString(),
                            this._Index,
                            this._Line,
                            this._Col);
                        //消耗当前字符
                        this.Consumn(token.Value);

                        return token;
                    }
                }
            }
        }

        //消耗文本
        private Consumn(val: string) {
            var linePoint = this._Str.NextPoint(new LinePoint(this._Index, this._Col, this._Line), val.length);

            this._Index = linePoint.Index;
            this._Line = linePoint.Y;
            this._Col = linePoint.X;
        }
    }
}
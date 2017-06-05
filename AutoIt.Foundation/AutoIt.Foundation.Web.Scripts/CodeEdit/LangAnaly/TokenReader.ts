module CodeEdit.LangAnaly {
    export class TokenReader {
        private _Egt: EgtManager;
        private _Str: string;

        private _Index: number = 0;
        private _Line: number = 0;
        private _Col: number = 0;

        constructor(egt: EgtManager, str: string) {
            this._Egt = egt;
            this._Str = str;
        }

        ReadToken(): Model.TokenInfo {
            if (this._Index == this._Str.length) {
                var endSymbol = $.Enumerable.From(this._Egt.SymbolGroup.ToArray())
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

            var state = this._Egt.DFAStateGroup.Get(0);
            var acceptSymbol: Model.Symbol = null;
            var accpetIndex = -1;

            while (true) {
                var edge: Model.DFAEdge = null;

                if (index <= this._Str.length - 1) {
                    var cha = this._Str[index];
                    edge = state.GetEdge(cha);
                }

                if (edge != null) {
                    state = edge.TargetState;

                    if (state.AcceptSymbol != null) {
                        acceptSymbol = state.AcceptSymbol;
                        accpetIndex = index;
                    }

                    index++;
                } else {
                    if (acceptSymbol != null) {
                        var token = new Model.TokenInfo(Model.TokenInfoState.Accept,
                            acceptSymbol,
                            this._Str.substr(startIndex, accpetIndex - startIndex + 1),
                            this._Index,
                            this._Line,
                            this._Col);
                        this.Consumn(token.Value);
                        return token;
                    } else {
                        var token = new Model.TokenInfo(Model.TokenInfoState.Error,
                            null,
                            this._Str[startIndex].toString(),
                            this._Index,
                            this._Line,
                            this._Col);
                        this.Consumn(token.Value);

                        return token;
                    }
                }
            }
        }

        private Consumn(val: string) {
      
            var linePoint = this._Str.NextPoint(val.length, new LinePoint(this._Index, this._Col, this._Line));

            this._Index = linePoint.Index;
            this._Line = linePoint.Y;
            this._Col = linePoint.X;
        }
    }
}
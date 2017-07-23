var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        //从字符串中读取记号
        var TokenReader = (function () {
            function TokenReader(egt, str) {
                //当前索引
                this._Index = 0;
                //当前行
                this._Line = 0;
                //当前列
                this._Col = 0;
                this._Egt = egt;
                this._Str = str;
            }
            //读取记号
            TokenReader.prototype.ReadToken = function () {
                //如果已读到字符串末尾就返回EndOfFile记号
                if (this._Index == this._Str.length) {
                    var endSymbol = this._Egt.SymbolGroup.ToEnumerble()
                        .First(function (item) { return item.Type == LangAnaly.Model.SymbolType.EndofFile; });
                    return new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.End, endSymbol, null, this._Index, this._Line, this._Col);
                }
                var index = this._Index;
                var startIndex = index;
                //开始状态
                var state = this._Egt.DFAStateGroup.Get(0);
                //接受记号
                var acceptSymbol = null;
                //接受索引
                var accpetIndex = -1;
                while (true) {
                    var edge = null;
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
                    }
                    else {
                        //如果有接受标记,则返回接受标记
                        if (acceptSymbol != null) {
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Accept, acceptSymbol, this._Str.substr(startIndex, accpetIndex - startIndex + 1), this._Index, this._Line, this._Col);
                            //消耗标记文本
                            this.Consumn(token.Value);
                            return token;
                        }
                        else {
                            //如果没有接受标记,则返回错误标记
                            var token = new LangAnaly.Model.TokenInfo(LangAnaly.Model.TokenInfoState.Error, null, this._Str[startIndex].toString(), this._Index, this._Line, this._Col);
                            //消耗当前字符
                            this.Consumn(token.Value);
                            return token;
                        }
                    }
                }
            };
            //消耗文本
            TokenReader.prototype.Consumn = function (val) {
                var linePoint = this._Str.NextPoint(new LinePoint(this._Index, this._Col, this._Line), val.length);
                this._Index = linePoint.Index;
                this._Line = linePoint.Y;
                this._Col = linePoint.X;
            };
            return TokenReader;
        }());
        LangAnaly.TokenReader = TokenReader;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

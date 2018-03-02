using System.Linq;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class TokenReader
    {
        private EgtManager _Egt;
        private string _Str;

        private int _Index = 0;
        private int _Line = 0;
        private int _Col = 0;

        public TokenReader(EgtManager egt, string str)
        {
            _Egt = egt;
            _Str = str;
        }

        public TokenInfo ReadToken()
        {
            if (_Index == _Str.Length)
            {
                return new TokenInfo(TokenInfoState.End, _Egt.SymbolGroup.First(item=>item.Type== SymbolType.EndofFile), null, 
                    _Index,_Line, _Col);
            }

            var index = _Index;
            var startIndex = index;

            var state = _Egt.DFAStateGroup[0];
            Symbol acceptSymbol = null;
            int accpetIndex = -1;

            while (true)
            {
                DFAEdge edge = null;

                if (index <= _Str.Length - 1)
                {
                    var cha = _Str[index];
                    edge = state.GetEdge(cha);
                }

                if (edge != null)
                {
                    state = edge.TargetState;

                    if (state.AcceptSymbol != null)
                    {
                        acceptSymbol = state.AcceptSymbol;
                        accpetIndex = index;
                    }

                    index++;
                }
                else
                {
                    if (acceptSymbol != null)
                    {
                        var token = new TokenInfo(TokenInfoState.Accept, acceptSymbol,
                            _Str.Substring(startIndex, accpetIndex - startIndex + 1),
                            _Index, _Line, _Col);
                        Consumn(token.Value);
                        return token;
                    }
                    else
                    {
                        var token = new TokenInfo(TokenInfoState.Error, null, _Str[startIndex].ToString(),
                            _Index, _Line, _Col);
                        Consumn(token.Value);

                        return token;
                    }
                }
            }
        }

        private void Consumn(string val)
        {
            var linePoint = _Str.NextPoint(new LinePoint(_Index, _Col, _Line), val.Length);

            _Index = linePoint.Index;
            _Line = linePoint.Y;
            _Col = linePoint.X;
        }
    }
}

using System.Collections.Generic;

namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class GramerInfo : SymbolInfoBase
    {
        public GramerState GramerState { get; set; }
        public List<SymbolInfoBase> ChildGroup { get; set; }

        public GramerInfo(GramerState gramerState, TokenInfo startToken) : base(startToken.Symbol, startToken.Value, startToken.Line, startToken.Col)
        {
            this.GramerState = gramerState;
            this.ChildGroup.Add(startToken);
        }
    }
}
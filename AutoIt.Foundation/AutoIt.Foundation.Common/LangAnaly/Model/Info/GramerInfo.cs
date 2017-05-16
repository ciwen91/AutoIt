using System.Collections.Generic;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class GramerInfo : SymbolInfoBase
    {
        public GramerState GramerState { get; set; }
        public TokenInfo StartToken { get; set; }
        public Produce Produce { get; set; }
        [JsonIgnore]
        public List<GramerInfo> ChildGroup { get; set; }=new List<GramerInfo>();

        public GramerInfo(GramerState gramerState, TokenInfo startToken)
            : base(startToken.Symbol, startToken.Value, startToken.Line, startToken.Col)
        {
            this.GramerState = gramerState;
            this.StartToken = startToken;
            this.Data = startToken.Data;
        }
    }
}
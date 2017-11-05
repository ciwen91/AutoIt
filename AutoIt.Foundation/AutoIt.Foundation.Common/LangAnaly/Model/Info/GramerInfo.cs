using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class GramerInfo : SymbolInfoBase
    {
        public GramerInfoState GramerState { get; set; }
        public TokenInfo StartToken { get; set; }
        public Produce Produce { get; set; }

        public GramerInfo Parent { get; set; }
        private List<GramerInfo> _ChildGroup=new List<GramerInfo>();
        [JsonIgnore]
        public List<GramerInfo> ChildGroup {
            get { return _ChildGroup; }
            set
            {
                this._ChildGroup = value;
                foreach (var item in _ChildGroup)
                {
                    item.Parent = this;
                }
            }
        }
        public int Level
        {
            get
            {
                if (this.Produce == null)
                {
                    return -1;
                }
                else if (this.ChildGroup.Count == 0)
                {
                    return 0;
                }
                else
                {
                    return this.ChildGroup.Max(item => item.Level+1);
                }
            }
        }

        public GramerInfo(GramerInfoState gramerState, TokenInfo startToken)
            : base(startToken.Symbol, startToken.Value,startToken.Index ,startToken.Line, startToken.Col)
        {
            this.GramerState = gramerState;
            this.StartToken = startToken;
            this.Data = startToken.Data;
        }
    }
}
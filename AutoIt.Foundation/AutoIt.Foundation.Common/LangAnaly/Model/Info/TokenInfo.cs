namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class TokenInfo: SymbolInfoBase
    {
        public TokenInfoState State { get; set; }

        public TokenInfo(TokenInfoState state, Symbol symbol, string value,int index,
            int line,int col):base(symbol,value,index,line,col)
        {
            this.State = state;
        }
    }
}
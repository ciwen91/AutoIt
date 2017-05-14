namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class TokenInfo: SymbolInfoBase
    {
        public TokenState State { get; set; }

        public TokenInfo(TokenState state, Symbol symbol, string value,
            int line,int col):base(symbol,value,line,col)
        {
            this.State = state;
        }
    }
}
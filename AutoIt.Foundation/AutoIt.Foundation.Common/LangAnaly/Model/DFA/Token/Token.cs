using Compiler.Egt;

namespace Compiler.Token
{
    public class Token: SymbolBase
    {
        public TokenState State { get; set; }

        public Token(TokenState state, Symbol symbol, string value,
            int line,int col):base(symbol,value,line,col)
        {
            this.State = state;
        }
    }

    public class GramerSymbol : SymbolBase
    {
        public LALRState.Action Action { get; set; }
        public GramerSymbol ChildGroup { get; set; }

        public GramerSymbol(LALRState.Action action,
            string value, int line, int col) : base(action.Symbol, value, line, col)
        {
            this.Action = action;
        }
    }
}
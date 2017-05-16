using AutoIt.Foundation.Common.LangAnaly.Model;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class CalculateLangManager : LangManagerBase
    {
        private enum SymbolIndex
        {
            @Eof = 0,                                  // (EOF)
            @Error = 1,                                // (Error)
            @Comment = 2,                              // Comment
            @Newline = 3,                              // NewLine
            @Whitespace = 4,                           // Whitespace
            @Minusminus = 5,                           // '--'
            @Timesdiv = 6,                             // '*/'
            @Divtimes = 7,                             // '/*'
            @Minus = 8,                                // '-'
            @Lparen = 9,                               // '('
            @Rparen = 10,                              // ')'
            @Times = 11,                               // '*'
            @Div = 12,                                 // '/'
            @Plus = 13,                                // '+'
            @Floatval = 14,                            // floatVal
            @Exp = 15,                                 // <Exp>
            @Expmul = 16,                              // <ExpMul>
            @Value = 17                                // <Value>
        }

        private enum ProductionIndex
        {
            @Exp_Plus = 0,                             // <Exp> ::= <Exp> '+' <ExpMul>
            @Exp_Minus = 1,                            // <Exp> ::= <Exp> '-' <ExpMul>
            @Exp = 2,                                  // <Exp> ::= <ExpMul>
            @Expmul_Times = 3,                         // <ExpMul> ::= <ExpMul> '*' <Value>
            @Expmul_Div = 4,                           // <ExpMul> ::= <ExpMul> '/' <Value>
            @Expmul = 5,                               // <ExpMul> ::= <Value>
            @Value_Floatval = 6,                       // <Value> ::= floatVal
            @Value_Lparen_Rparen = 7                   // <Value> ::= '(' <Exp> ')'
        }

        public CalculateLangManager(string egtPath) : base(egtPath)
        {
        }

        public override void TokenRead(TokenInfo tokenInfo)
        {
            switch ((SymbolIndex)tokenInfo.Symbol.ID)
            {
                    case SymbolIndex.Floatval:
                    tokenInfo.Data = float.Parse(tokenInfo.Value);
                    break;
            }
        }

        public override void GramerRead(GramerInfo gramerInfo)
        {
            switch ((ProductionIndex)gramerInfo.Produce.ID)
            {
                case ProductionIndex.Exp_Plus:
                    gramerInfo.Data = (float)gramerInfo.ChildGroup[0].Data + (float)gramerInfo.ChildGroup[2].Data;
                    break;
                case ProductionIndex.Exp_Minus:
                    gramerInfo.Data = (float)gramerInfo.ChildGroup[0].Data - (float)gramerInfo.ChildGroup[2].Data;
                    break;
                case ProductionIndex.Expmul_Times:
                    gramerInfo.Data = (float)gramerInfo.ChildGroup[0].Data * (float)gramerInfo.ChildGroup[2].Data;
                    break;
                case ProductionIndex.Expmul_Div:
                    gramerInfo.Data = (float)gramerInfo.ChildGroup[0].Data / (float)gramerInfo.ChildGroup[2].Data;
                    break;
                case  ProductionIndex.Value_Lparen_Rparen:
                    gramerInfo.Data = gramerInfo.ChildGroup[1].Data;
                    break;
                default:
                    gramerInfo.Data = gramerInfo.ChildGroup[0].Data;
                    break;
            }
        }
    }
}
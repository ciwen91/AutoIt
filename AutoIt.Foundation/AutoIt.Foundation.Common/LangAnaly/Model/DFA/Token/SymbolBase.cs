using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Compiler.Egt;

namespace Compiler.Token
{
   public class SymbolBase
    {
        public Symbol Symbol { get; set; }
        public string Value { get; set; }
        public int Line { get; set; }
        public int Col { get; set; }

        public SymbolBase(Symbol symbol, string value,
            int line, int col)
        {
            this.Symbol = symbol;
            this.Value = value;
            this.Line = line;
            this.Col = col;
        }
    }
}

using System.Collections.Generic;

namespace Compiler.Egt
{
    public class Produce : EgtEntityBase
    {
        public Symbol NonTerminal { get; set; }
        public List<Symbol> SymbolGroup { get; set; }
    }
}
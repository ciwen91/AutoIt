using System.Collections.Generic;

namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class Produce : EgtEntityBase
    {
        public Symbol NonTerminal { get; set; }
        public List<Symbol> SymbolGroup { get; set; }
    }
}
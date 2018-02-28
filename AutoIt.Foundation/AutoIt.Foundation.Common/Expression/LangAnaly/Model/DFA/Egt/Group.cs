using System.Collections.Generic;

namespace Compiler.Egt
{
    public class Group:EgtEntityBase
    {
        public string Name { get; set; }
        public Symbol Container { get; set; }
        public Symbol Start { get; set; }
        public Symbol End { get; set; }
        public AdvanceMode AdvanceMode { get; set; }
        public EndingMode EndingMode { get; set; }
        public List<Symbol> NestGroup { get; set; } = new List<Symbol>();
    }
}
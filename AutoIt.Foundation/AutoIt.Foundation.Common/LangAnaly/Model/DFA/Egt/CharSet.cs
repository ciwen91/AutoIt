using System.Collections.Generic;

namespace Compiler.Egt
{
    public class CharSet:EgtEntityBase
    {
        public List<CharSetItem> Group { get; set; }

        public class CharSetItem
        {
            public int Start { get; set; }
            public int End { get; set; }
        }
    }
}
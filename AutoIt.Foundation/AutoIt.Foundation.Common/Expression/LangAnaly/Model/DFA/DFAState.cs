using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class DFAState : EgtEntityBase
    {
        public Symbol AcceptSymbol { get; set; }
        public List<DFAEdge> EdgGroup { get; set; } = new List<DFAEdge>();

        public DFAEdge GetEdge(char cha)
        {
            var edge = EdgGroup.FirstOrDefault(item => item.IsFit(cha));
            return edge;
        }
    }
}
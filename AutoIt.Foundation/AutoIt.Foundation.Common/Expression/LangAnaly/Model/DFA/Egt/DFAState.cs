using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Compiler.Egt
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

    public class DFAEdge
    {
        public CharSet CharSet { get; set; }
        [JsonIgnore]
        public DFAState TargetState { get; set; }

        public bool IsFit(char cha)
        {
            return CharSet.Group.Any(item => cha >= item.Start && cha <= item.End);
        }
    }
}
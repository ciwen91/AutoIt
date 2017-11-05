using System.Linq;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
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
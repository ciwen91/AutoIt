using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class LALRAction
    {
        public Symbol Symbol { get; set; }
        public ActionType ActionType { get; set; }
        [JsonIgnore]
        public LALRState TargetState { get; set; }
        [JsonIgnore]
        public Produce TargetRule { get; set; }
    }
}
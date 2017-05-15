using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly.Model
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
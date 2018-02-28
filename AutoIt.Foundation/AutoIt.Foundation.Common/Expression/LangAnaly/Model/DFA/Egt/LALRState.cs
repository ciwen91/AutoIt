using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace Compiler.Egt
{
    public class LALRState : EgtEntityBase
    {
        public List<Action> ActionGroup=new List<Action>();

        public class  Action
        {
            public Symbol Symbol { get; set; }
            public ActionType ActionType { get; set; }
            [JsonIgnore]
            public LALRState TargetState { get; set; }
        }

        public  Action GetAction(Symbol symbol)
        {
            var action = this.ActionGroup.FirstOrDefault(item => item.Symbol == symbol);
            return action;
        }
    }
}
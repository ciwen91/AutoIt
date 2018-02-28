using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class LALRState : EgtEntityBase
    {
        public List<LALRAction> ActionGroup=new List<LALRAction>();

        public  LALRAction GetAction(Symbol symbol)
        {
            var action = this.ActionGroup.FirstOrDefault(item => item.Symbol == symbol);
            return action;
        }
    }
}
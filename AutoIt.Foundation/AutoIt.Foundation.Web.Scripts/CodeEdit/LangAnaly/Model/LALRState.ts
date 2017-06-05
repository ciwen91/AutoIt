module CodeEdit.LangAnaly.Model {
    export class LALRState extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        ActionGroup: List<CodeEdit.LangAnaly.Model.LALRAction> = new List<CodeEdit.LangAnaly.Model.LALRAction>();

        GetAction(symbol: Symbol) {
            var action = $.Enumerable.From(this.ActionGroup.ToArray()).FirstOrDefault(null, item => item.Symbol == symbol);
            return action;
        }
    }
}
module CodeEdit.LangAnaly.Model {
    //LALR状态
    export class LALRState extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //动作列表
        ActionGroup: List<CodeEdit.LangAnaly.Model.LALRAction> = new List<CodeEdit.LangAnaly.Model.LALRAction>();

        //获取动作(符号)
        GetAction(symbol: Symbol) {
            var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, item => item.Symbol == symbol);
            return action;
        }
    }
}
module CodeEdit.LangAnaly.Model {
    //LALR״̬
    export class LALRState extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //�����б�
        ActionGroup: List<CodeEdit.LangAnaly.Model.LALRAction> = new List<CodeEdit.LangAnaly.Model.LALRAction>();

        //��ȡ����(����)
        GetAction(symbol: Symbol) {
            var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, item => item.Symbol == symbol);
            return action;
        }
    }
}
module CodeEdit.LangAnaly.Model {
    //LALR����
    export class LALRAction {
        //����
        Symbol: CodeEdit.LangAnaly.Model.Symbol;
        //��������
        ActionType: CodeEdit.LangAnaly.Model.ActionType;
        //Ŀ��״̬
        TargetState: CodeEdit.LangAnaly.Model.LALRState;
        //Ŀ�����ʽ
        TargetRule: CodeEdit.LangAnaly.Model.Produce;
    }
}
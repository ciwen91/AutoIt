module CodeEdit.LangAnaly.Model {
    //LALR动作
    export class LALRAction {
        //符号
        Symbol: CodeEdit.LangAnaly.Model.Symbol;
        //动作类型
        ActionType: CodeEdit.LangAnaly.Model.ActionType;
        //目标状态
        TargetState: CodeEdit.LangAnaly.Model.LALRState;
        //目标产生式
        TargetRule: CodeEdit.LangAnaly.Model.Produce;
    }
}
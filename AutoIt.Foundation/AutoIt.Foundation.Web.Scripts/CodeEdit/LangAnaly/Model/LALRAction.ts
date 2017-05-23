module CodeEdit.LangAnaly.Model {
    export class LALRAction {
        Symbol: CodeEdit.LangAnaly.Model.Symbol;
        ActionType: CodeEdit.LangAnaly.Model.ActionType;
        TargetState: CodeEdit.LangAnaly.Model.LALRState;
        TargetRule: CodeEdit.LangAnaly.Model.Produce;
    }
}
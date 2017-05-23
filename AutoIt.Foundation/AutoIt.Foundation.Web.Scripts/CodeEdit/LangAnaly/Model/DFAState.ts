module CodeEdit.LangAnaly.Model {
    export class DFAState extends  CodeEdit.LangAnaly.Model.EgtEntityBase {
        AcceptSymbol: CodeEdit.LangAnaly.Model.Symbol;
        EdgGroup:List<CodeEdit.LangAnaly.Model.DFAEdge>=new List<CodeEdit.LangAnaly.Model.DFAEdge>();
    }
}
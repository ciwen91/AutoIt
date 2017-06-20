module CodeEdit.LangAnaly.Model {
    //产生式
    export class  Produce extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //产生式头
        NonTerminal: CodeEdit.LangAnaly.Model.Symbol;
        //产生式主体
        SymbolGroup:List<CodeEdit.LangAnaly.Model.Symbol>;
    }
}
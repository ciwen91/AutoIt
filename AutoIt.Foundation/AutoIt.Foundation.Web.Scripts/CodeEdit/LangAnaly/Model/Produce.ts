module CodeEdit.LangAnaly.Model {
    //����ʽ
    export class  Produce extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //����ʽͷ
        NonTerminal: CodeEdit.LangAnaly.Model.Symbol;
        //����ʽ����
        SymbolGroup:List<CodeEdit.LangAnaly.Model.Symbol>;
    }
}
module CodeEdit.LangAnaly.Model {
    //·Ö×é
    export class Group extends EgtEntityBase{
        Name: string;
        Container: CodeEdit.LangAnaly.Model.Symbol;
        Start: CodeEdit.LangAnaly.Model.Symbol;
        End: CodeEdit.LangAnaly.Model.Symbol;
        AdvanceMode: CodeEdit.LangAnaly.Model.AdvanceMode;
        EndingMode: CodeEdit.LangAnaly.Model.EndingMode;
        NestGroup: List<CodeEdit.LangAnaly.Model.Symbol>;
    }
}
namespace CodeEdit.LangAnaly {
    export class  EgtManager {
        Info: string;
        CharSetGroup = new List<Model.CharSet>();
        SymbolGroup = new List<Model.Symbol>();
        GroupGroup = new List<Model.Group>();
        ProduceGroup = new List<Model.Produce>();
        DFAStateGroup = new List<Model.DFAState>();
        LALRStateGroup=new List<Model.LALRState>();

        static CreateFromStr(str: string) {

        }
    }
}
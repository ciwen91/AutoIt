module CodeEdit.LangAnaly.Model {
    //DFA状态
    export class DFAState extends  CodeEdit.LangAnaly.Model.EgtEntityBase {
        //接受符号
        AcceptSymbol: CodeEdit.LangAnaly.Model.Symbol;
        //边集合
        EdgGroup: List<CodeEdit.LangAnaly.Model.DFAEdge> = new List<CodeEdit.LangAnaly.Model.DFAEdge>();

        //获取匹配的边(字符)
        GetEdge(cha: string): Model.DFAEdge {
            var edge = $.Enumerable.From(this.EdgGroup.ToArray())
                .FirstOrDefault(null, item => item.IsFit(cha));
            return edge;
        }
    }
}
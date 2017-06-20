module CodeEdit.LangAnaly.Model {
    //DFA״̬
    export class DFAState extends  CodeEdit.LangAnaly.Model.EgtEntityBase {
        //���ܷ���
        AcceptSymbol: CodeEdit.LangAnaly.Model.Symbol;
        //�߼���
        EdgGroup: List<CodeEdit.LangAnaly.Model.DFAEdge> = new List<CodeEdit.LangAnaly.Model.DFAEdge>();

        //��ȡƥ��ı�(�ַ�)
        GetEdge(cha: string): Model.DFAEdge {
            var edge = $.Enumerable.From(this.EdgGroup.ToArray())
                .FirstOrDefault(null, item => item.IsFit(cha));
            return edge;
        }
    }
}
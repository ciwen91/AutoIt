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

        //��ȡ���ܽ��ܵķ���(�ַ���,���ʹ���״̬)
        GetMayAcceptSymbolGroup(str: string, visiteStateGroup: List<Model.DFAState> = new List<Model.DFAState>()): List<Model.Symbol> {
            var group = new List<Model.Symbol>();

            //������ʹ��򷵻�,������
            if (visiteStateGroup.Contains(this)) {
                return group;
            }
            else {
                visiteStateGroup.Set(this);
            }

            //����ַ�������Ϊ0,����ƥ��
            if (str.length > 0) {
                var edge = this.GetEdge(str[0]);
                //ƥ��ʧ��ֱ�ӷ���
                if (edge == null) {
                    return group;
                }
                //�ɹ���ƥ����һ��״̬
                else {
                    return edge.TargetState.GetMayAcceptSymbolGroup(str.substr(1), visiteStateGroup);
                }
            }
            else {
                //��ǰ״̬�Ŀɽ��ܵķ���
                if (this.AcceptSymbol != null) {
                    group.Set(this.AcceptSymbol);
                }

                //����״̬�Ŀɽ��ܵķ���
                var nextGroup = this.EdgGroup.ToEnumerble()
                    .SelectMany(item => item.TargetState.GetMayAcceptSymbolGroup(str, visiteStateGroup).ToArray())
                    .ToList();
                group.SetRange(nextGroup);

                group = group.ToEnumerble().Distinct().ToList();

                return group;
            }

        }
    }
}
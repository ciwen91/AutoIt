module CodeEdit.LangAnaly.Model {
    //DFA��
    export class DFAEdge {
        //�ַ���
        CharSet: CodeEdit.LangAnaly.Model.CharSet;
        //Ŀ��״̬
        TargetState: CodeEdit.LangAnaly.Model.DFAState;

        //�ַ��Ƿ��ڱ���
        IsFit(cha: string): boolean {
            var code = cha.charCodeAt(0);
            return $.Enumerable.From(this.CharSet.Group.ToArray()).Any(item => code >= item.Start && code <= item.End);
        }
    }
}
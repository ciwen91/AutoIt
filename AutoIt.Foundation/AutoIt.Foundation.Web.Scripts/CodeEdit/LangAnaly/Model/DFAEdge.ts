module CodeEdit.LangAnaly.Model {
    //DFA边
    export class DFAEdge {
        //字符集
        CharSet: CodeEdit.LangAnaly.Model.CharSet;
        //目标状态
        TargetState: CodeEdit.LangAnaly.Model.DFAState;

        //字符是否在边上
        IsFit(cha: string): boolean {
            var code = cha.charCodeAt(0);
            return $.Enumerable.From(this.CharSet.Group.ToArray()).Any(item => code >= item.Start && code <= item.End);
        }
    }
}
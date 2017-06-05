module CodeEdit.LangAnaly.Model {
    export class DFAEdge {
        CharSet: CodeEdit.LangAnaly.Model.CharSet;
        TargetState: CodeEdit.LangAnaly.Model.DFAState;

        IsFit(cha: string): boolean {
            var code = cha.charCodeAt(0);
            return $.Enumerable.From(this.CharSet.Group.ToArray()).Any(item => code >= item.Start && code <= item.End);
        }
    }
}
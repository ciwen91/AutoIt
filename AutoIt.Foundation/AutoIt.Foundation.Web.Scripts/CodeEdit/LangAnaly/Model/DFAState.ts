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

        //获取可能接受的符号(字符串,访问过的状态)
        GetMayAcceptSymbolGroup(str: string, visiteStateGroup: List<Model.DFAState> = new List<Model.DFAState>()): List<Model.Symbol> {
            var group = new List<Model.Symbol>();

            //如果访问过则返回,否则标记
            if (visiteStateGroup.Contains(this)) {
                return group;
            }
            else {
                visiteStateGroup.Set(this);
            }

            //如果字符串长度为0,则尝试匹配
            if (str.length > 0) {
                var edge = this.GetEdge(str[0]);
                //匹配失败直接返回
                if (edge == null) {
                    return group;
                }
                //成功则匹配下一个状态
                else {
                    return edge.TargetState.GetMayAcceptSymbolGroup(str.substr(1), visiteStateGroup);
                }
            }
            else {
                //当前状态的可接受的符号
                if (this.AcceptSymbol != null) {
                    group.Set(this.AcceptSymbol);
                }

                //后面状态的可接受的符号
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
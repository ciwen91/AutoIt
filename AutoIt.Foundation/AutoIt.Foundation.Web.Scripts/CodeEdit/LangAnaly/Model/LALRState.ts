module CodeEdit.LangAnaly.Model {
    //LALR状态
    export class LALRState extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //动作列表
        ActionGroup: List<CodeEdit.LangAnaly.Model.LALRAction> = new List<CodeEdit.LangAnaly.Model.LALRAction>();

        //获取动作(符号)
        GetAction(symbol: Symbol) {
            var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, item => item.Symbol == symbol);
            return action;
        }

        private _MayParentSymbolGroup: List<Model.Symbol> = null;

        //获取可能的父符号
        GetMayParentSymbolGroup(): List<Model.Symbol> {
            //如果计算过,则直接返回
            if (this._MayParentSymbolGroup != null) {
                return this._MayParentSymbolGroup;
            }
            //否则计算结果
            else {
                var group = this.GetMayParentSymbolGroup$(1, new List<Model.LALRState>());
                group = group.ToEnumerble().Distinct().ToList();
                this._MayParentSymbolGroup = group;

                return group;
            }
        }

        //获取可能的父符号
        private GetMayParentSymbolGroup$(deep: number, visitedStateGroup: List<Model.LALRState>): List<Model.Symbol> {
            //如果访问过则返回,否则标记访问过
            if (visitedStateGroup.Contains(this)) {
                return new List<Model.Symbol>();
            } else {
                visitedStateGroup.Set(this);
            }

            //找到所有的深度大于等于当前深度的规约元素
            var curGroup = this.ActionGroup.ToEnumerble()
                .Where(item => item
                    .ActionType ==
                    Model.ActionType.Reduce &&
                    item.TargetRule.SymbolGroup.Count() >= deep)
                .Select(item => item.TargetRule.NonTerminal)
                .ToList();

            //对于移入和GoTo元素,找到深度+1的父元素
            var mayGroup = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Shift || item.ActionType == Model.ActionType.Goto)
                .SelectMany(item => item.TargetState.GetMayParentSymbolGroup$(deep + 1, visitedStateGroup).ToArray())
                .ToList();

            var resultGroup = curGroup.SetRange(mayGroup);

            return resultGroup;
        }
    }
}
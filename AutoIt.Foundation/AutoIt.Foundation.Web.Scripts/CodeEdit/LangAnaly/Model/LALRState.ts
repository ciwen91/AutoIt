module CodeEdit.LangAnaly.Model {
    //LALR״̬
    export class LALRState extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //�����б�
        ActionGroup: List<CodeEdit.LangAnaly.Model.LALRAction> = new List<CodeEdit.LangAnaly.Model.LALRAction>();

        //��ȡ����(����)
        GetAction(symbol: Symbol) {
            var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, item => item.Symbol == symbol);
            return action;
        }

        private _MayParentSymbolGroup: List<Model.Symbol> = null;

        //��ȡ���ܵĸ�����
        GetMayParentSymbolGroup(): List<Model.Symbol> {
            //��������,��ֱ�ӷ���
            if (this._MayParentSymbolGroup != null) {
                return this._MayParentSymbolGroup;
            }
            //���������
            else {
                var group = this.GetMayParentSymbolGroup$(1, new List<Model.LALRState>());
                group = group.ToEnumerble().Distinct().ToList();
                this._MayParentSymbolGroup = group;

                return group;
            }
        }

        //��ȡ���ܵĸ�����
        private GetMayParentSymbolGroup$(deep: number, visitedStateGroup: List<Model.LALRState>): List<Model.Symbol> {
            //������ʹ��򷵻�,�����Ƿ��ʹ�
            if (visitedStateGroup.Contains(this)) {
                return new List<Model.Symbol>();
            } else {
                visitedStateGroup.Set(this);
            }

            //�ҵ����е���ȴ��ڵ��ڵ�ǰ��ȵĹ�ԼԪ��
            var curGroup = this.ActionGroup.ToEnumerble()
                .Where(item => item
                    .ActionType ==
                    Model.ActionType.Reduce &&
                    item.TargetRule.SymbolGroup.Count() >= deep)
                .Select(item => item.TargetRule.NonTerminal)
                .ToList();

            //���������GoToԪ��,�ҵ����+1�ĸ�Ԫ��
            var mayGroup = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Shift || item.ActionType == Model.ActionType.Goto)
                .SelectMany(item => item.TargetState.GetMayParentSymbolGroup$(deep + 1, visitedStateGroup).ToArray())
                .ToList();

            var resultGroup = curGroup.SetRange(mayGroup);

            return resultGroup;
        }
    }
}
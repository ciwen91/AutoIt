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

      
        //#region ���������׹�Լ�ķ���

        //��ȡ���������׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬,���в���ʽ)
        GetNextSymbol(stateGroup: List<LALRState>, allProduce: List<Produce>): Model.Symbol {
            var sym = null;

            //��ȡ��ԼԪ��(���׹�Լ)
            if (sym == null) {
                sym = this.GetNextReduceSymbol(stateGroup);
            }
            //��ȡGoToԪ��(��������ʱһ�����Һ���ѭ��,���뱾��Ҳ��װ��ΪGoTo)
            if (sym == null) {
                sym = this.GetNextGotoSymbol(allProduce);
            }
            //��ȡ����Ԫ��
            if (sym == null) {
                sym = this.GetNextShiftSymbol();
            }

            return sym;
        }

        //��ȡ�����׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬)
        private GetNextReduceSymbol(stateGroup: List<LALRState>): Model.Symbol {
            var resultReduceGroup = new List<Model.LALRAction>();

            //���Ϲ�Լ,ֱ�����ܹ�Լ
            while (true) {
                var curState = stateGroup.Get();
                var reduceGroup = curState.GetActionGroup(ActionType.Reduce);

                if (reduceGroup.Count() < 1) {
                    break;
                }

                resultReduceGroup = reduceGroup;
                LALRState.Reduce(stateGroup);
            }

            //ȡ��һ����Լ����Ԫ��
            var sym = resultReduceGroup.ToEnumerble()
                .Select(item => item.Symbol)
                .FirstOrDefault(null);
            return sym;
        }

        //��ȡ��������ת�ķ���(���в���ʽ)
        private GetNextGotoSymbol(allProduce: List<Produce>): Model.Symbol {
            //���ݲ���ʽ�Ĺ�ϵ,��ȡ��ת���Ĳ���ʽ
            var sym = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Goto)
                .OrderByCompareFunc((a, b) => Produce.Compare(a.Symbol, b.Symbol, allProduce))
                .Select(item=>item.Symbol)
                .FirstOrDefault(null);
            return sym;
        }

        //��ȡ����������ķ���
        private GetNextShiftSymbol(): Model.Symbol {
            //��ȡ���һ���������
            var sym = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Shift)
                .Select(item => item.Symbol)
                .LastOrDefault(null);
            return sym;
        }

        //#endregion

        //#reginon ��������
        //��Լ(��ǰ״̬��ջ:����������״̬)
        private static Reduce(stateGroup: List<LALRState>): boolean {
            var curState = stateGroup.Get();

            //������ܹ�Լ����false
            if (!curState.CanReduce()) {
                return false;
            } else {
                var produce = curState.GetProduce();
                var cnt = produce.SymbolGroup.Count();

                //����������Ÿ���״̬
                while (cnt > 0) {
                    stateGroup.Remove();
                    cnt--;
                }

                //ִ��GoTo��ת
                var state = stateGroup.Get();
                var nextState = state.GetAction(produce.NonTerminal).TargetState;
                stateGroup.Set(nextState);

                return true;
            }
        }

        //�Ƿ���Խ���
        CanAccept(): boolean {
            var canAccept = this.ActionGroup.ToEnumerble().Any(item => item.Symbol.Name == "EOF");
            return canAccept;
        }

        //�Ƿ���Թ�Լ
        CanReduce(): boolean {
            var canReduce = this.ActionGroup.ToEnumerble().Any(item => item.ActionType == Model.ActionType.Reduce);
            return canReduce;
        }

        //��ȡ����ʽ
        GetProduce(): Model.Produce {
            var actionGroup = this.GetActionGroup(Model.ActionType.Reduce);
            var produce = actionGroup.Count()>0 ? actionGroup.Get(0).TargetRule : null;

            return produce;
        }

        //��ȡָ�����Ͷ�������(��������)
        private GetActionGroup(typ: ActionType): List<Model.LALRAction> {
            return this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == typ)
                .ToList();
        }
        //#endregion
    }
}
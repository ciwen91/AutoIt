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

      
        //#region 后面最容易规约的符号

        //获取后面最容易规约的符号(当前状态堆栈:不含错误状态,所有产生式)
        GetNextSymbol(stateGroup: List<LALRState>, allProduce: List<Produce>): Model.Symbol {
            var sym = null;

            //获取规约元素(最易规约)
            if (sym == null) {
                sym = this.GetNextReduceSymbol(stateGroup);
            }
            //获取GoTo元素(避免移入时一步步找和死循环,移入本身也会装好为GoTo)
            if (sym == null) {
                sym = this.GetNextGotoSymbol(allProduce);
            }
            //获取移入元素
            if (sym == null) {
                sym = this.GetNextShiftSymbol();
            }

            return sym;
        }

        //获取最容易规约的符号(当前状态堆栈:不含错误状态)
        private GetNextReduceSymbol(stateGroup: List<LALRState>): Model.Symbol {
            var resultReduceGroup = new List<Model.LALRAction>();

            //不断规约,直至不能规约
            while (true) {
                var curState = stateGroup.Get();
                var reduceGroup = curState.GetActionGroup(ActionType.Reduce);

                if (reduceGroup.Count() < 1) {
                    break;
                }

                resultReduceGroup = reduceGroup;
                LALRState.Reduce(stateGroup);
            }

            //取第一个规约最多的元素
            var sym = resultReduceGroup.ToEnumerble()
                .Select(item => item.Symbol)
                .FirstOrDefault(null);
            return sym;
        }

        //获取最容易跳转的符号(所有产生式)
        private GetNextGotoSymbol(allProduce: List<Produce>): Model.Symbol {
            //根据产生式的关系,获取跳转最多的产生式
            var sym = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Goto)
                .OrderByCompareFunc((a, b) => Produce.Compare(a.Symbol, b.Symbol, allProduce))
                .Select(item=>item.Symbol)
                .FirstOrDefault(null);
            return sym;
        }

        //获取最容易移入的符号
        private GetNextShiftSymbol(): Model.Symbol {
            //暂取最后一个移入符号
            var sym = this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == Model.ActionType.Shift)
                .Select(item => item.Symbol)
                .LastOrDefault(null);
            return sym;
        }

        //#endregion

        //#reginon 基础方法
        //规约(当前状态堆栈:不包含错误状态)
        private static Reduce(stateGroup: List<LALRState>): boolean {
            var curState = stateGroup.Get();

            //如果不能规约返回false
            if (!curState.CanReduce()) {
                return false;
            } else {
                var produce = curState.GetProduce();
                var cnt = produce.SymbolGroup.Count();

                //撤销主体符号个数状态
                while (cnt > 0) {
                    stateGroup.Remove();
                    cnt--;
                }

                //执行GoTo跳转
                var state = stateGroup.Get();
                var nextState = state.GetAction(produce.NonTerminal).TargetState;
                stateGroup.Set(nextState);

                return true;
            }
        }

        //是否可以接受
        CanAccept(): boolean {
            var canAccept = this.ActionGroup.ToEnumerble().Any(item => item.Symbol.Name == "EOF");
            return canAccept;
        }

        //是否可以规约
        CanReduce(): boolean {
            var canReduce = this.ActionGroup.ToEnumerble().Any(item => item.ActionType == Model.ActionType.Reduce);
            return canReduce;
        }

        //获取产生式
        GetProduce(): Model.Produce {
            var actionGroup = this.GetActionGroup(Model.ActionType.Reduce);
            var produce = actionGroup.Count()>0 ? actionGroup.Get(0).TargetRule : null;

            return produce;
        }

        //获取指定类型动作集合(动作类型)
        private GetActionGroup(typ: ActionType): List<Model.LALRAction> {
            return this.ActionGroup.ToEnumerble()
                .Where(item => item.ActionType == typ)
                .ToList();
        }
        //#endregion
    }
}
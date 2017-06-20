
namespace CodeEdit.LangAnaly {
    //从标记流中读取语法信息
    export class GramerReader {
        //Egt信息
        private _EgtStorer: EgtStorer;
        //语法堆栈(下一个状态,当前语法)
        private _GrammerGroup: List<Tuple<Model.LALRState, Model.GramerInfo>> = new
            List<Tuple<Model.LALRState, Model.GramerInfo>>();

        constructor(egtStorer: EgtStorer) {
            this._EgtStorer = egtStorer;

            var topInfo = new Tuple<Model.LALRState, Model.GramerInfo>(egtStorer.LALRStateGroup.Get(0), null);
            this._GrammerGroup.Set(topInfo);
        }

        //获取语法列表
        GetGramerGroup(): List<Tuple<Model.LALRState, Model.GramerInfo>> {
            return $.Enumerable.From(this._GrammerGroup.ToArray()).ToList();
        }

        //读取语法(符号)
        ReadGramer(tokenInfo: Model.TokenInfo): Model.GramerInfo {
            //当前状态
            var curState = this._GrammerGroup.Get().Item1;
            //符号对应的动作
            var action = curState.GetAction(tokenInfo.Symbol);

            //没有对应的动作则返回语法错误
            if (action == null) {
                return new Model.GramerInfo(Model.GramerInfoState.Error, tokenInfo);
            } else {
                //移入
                if (action.ActionType == Model.ActionType.Shift) {
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Shift, tokenInfo);
                    //将状态和语法符号移入堆栈
                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState, Model.GramerInfo>(action.TargetState, gramerSymbol));

                    return gramerSymbol;
                }
                //规约
                else if (action.ActionType == Model.ActionType.Reduce) {
                    var produce = action.TargetRule;
                    var prodSymbolCount = produce.SymbolGroup.Count();

                    //将产生式的主体移出堆栈
                    var group = Loop.For(prodSymbolCount)
                        .Select(item => this._GrammerGroup.Remove())
                        .Reverse()
                        .ToList();
                    //语法首符号为子语法的首符号或空符号
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Reduce,
                        group.Count() > 0
                        ? group.Get(0).Item2.StartToken
                            : Model.TokenInfo.NullToken());
                    gramerSymbol.SetChildGroup($.Enumerable.From(group.ToArray()).Select(item => item.Item2).ToList());
                    //语法文本为子语法文本的结合
                    gramerSymbol.Value = $.Enumerable.From(group.ToArray())
                        .Select(item => item.Item2.Value)
                        .ToArray()
                        .join("");
                    //语法符号为产生式头部
                    gramerSymbol.Symbol = produce.NonTerminal;
                    gramerSymbol.Produce = produce;

                    //下一个状态为当前状态匹配动作的目标状态
                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState,
                            Model.
                            GramerInfo>(this._GrammerGroup.Get().Item1.GetAction(produce.NonTerminal).TargetState,
                            gramerSymbol));
                    return gramerSymbol;
                }
                //接受
                else if (action.ActionType == Model.ActionType.Accept) {
                    //根语法
                    var gramerInfo = this._GrammerGroup.Get().Item2;

                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Accept, tokenInfo);
                    gramerSymbol.SetChildGroup(new List<Model.GramerInfo>().Set(gramerInfo));
                    //接受语法的文本和值与根语法相同
                    gramerSymbol.Value = gramerInfo.Value;
                    gramerSymbol.Data = gramerInfo.Data;

                    return gramerSymbol;
                } else {
                    throw "NotSupportedException";
                }
            }
        }

        //获取所有可能的父符号(当前语法)
        GetParentMaySymbolGroup(gramer: Model.GramerInfo): List<Model.Symbol> {
            var parentMaySymbolGroup = new List<Model.Symbol>();

            //如果有父语法,则为父语法的符号
            if (gramer.Parent != null) {
                parentMaySymbolGroup.Set(gramer.Parent.Symbol);
            } else {
                var index = this.GetIndex(gramer);

                //从上一个状态开始,找最近的GoTo动作上的符号
                while (index > 0) {
                    var preState = this._GrammerGroup.Get(index - 1).Item1;
                    
                    parentMaySymbolGroup = preState.ActionGroup.ToEnumerble()
                        .Where(sItem => sItem.ActionType == Model.ActionType.Goto)
                        .Select(sItem => sItem.Symbol)
                        .ToList();

                    if (parentMaySymbolGroup.Count() > 0) {
                        break;
                    } else {
                        index--;
                    };
                }
            }

            return parentMaySymbolGroup;
        }

        //自动补全不完整的语法
        AutoComplete(): boolean {
            //当前语法
            var grammer = this._GrammerGroup.Get().Item2;
            //非可选的语法不补全
            if (!this.IsInOptionPro(grammer)) {
                return false;
            }

            var index = this.GetIndex(grammer);

            //从当前状态开始不断移入节点,直到可以规约(根据语法信息)
            while (true) {
                var state = this._GrammerGroup.Get(index).Item1;
                var actionGroup = state.ActionGroup.ToEnumerble();

                if (actionGroup.Any(item => item.ActionType == Model.ActionType.Reduce)) {
                    break;
                }

                //寻找第一个移入类的动作
                var shift = actionGroup.First(item => item.ActionType == Model.ActionType.Shift);
                //构造移入符号并读入符号
                var tokenInfo = new Model.TokenInfo(Model.TokenInfoState.Accept, shift.Symbol, null, -1, -1, -1);
                this.ReadGramer(tokenInfo);

                index++;
            }

            //状态为自动补全
            grammer.GramerState = Model.GramerInfoState.AutoComplete;

            return true;
        }

        //是否位于可选的语法
        private IsInOptionPro(grammer: Model.GramerInfo): boolean {
            var index = this.GetIndex(grammer);
            var state = this._GrammerGroup.Get(index).Item1;
            var gramer = this._GrammerGroup.Get(index).Item2;


            //if (gramer.Produce != null) {
            //    return false;
            //}

            //如果当前状态有Reduce动作,则不是必须的(说明当前状态可以Reduce,错误是由后面的字符导致的)
            if (state.ActionGroup.ToEnumerble()
                .Any(item => item.ActionType == Model.ActionType.Reduce)) {
                return false;
            }

            //从上一个状态开始,如果能找的Reduce动作则不是必须的(说明可以不经过当前状态而Reduce)
            while (index >= 1) {               
                var preState = this._GrammerGroup.Get(index - 1).Item1;

                if (preState.ActionGroup.ToEnumerble()
                    .Any(item => item.ActionType == Model.ActionType.Reduce)) {
                    return true;
                }

                index--;
            }

            return false;
        }

        private GetIndex(grammer: Model.GramerInfo): number {
            var index = $.Enumerable.From(this._GrammerGroup.ToArray())
                .Select(item => item.Item2)
                .IndexOf(grammer);

            return index;
        }
    }
}

namespace CodeEdit.LangAnaly {
    export class GramerReader {
        private _EgtManager: EgtManager;
        private _GrammerGroup: List<Tuple<Model.LALRState, Model.GramerInfo>> = new
            List<Tuple<Model.LALRState, Model.GramerInfo>>();

        constructor(edgManager: EgtManager) {
            this._EgtManager = edgManager;

            var topInfo = new Tuple<Model.LALRState, Model.GramerInfo>(edgManager.LALRStateGroup.Get(0), null);
            this._GrammerGroup.Set(topInfo);
        }

        ReadGramer(tokenInfo: Model.TokenInfo): Model.GramerInfo {
            var curState = this._GrammerGroup.Get().Item1;
            var action = curState.GetAction(tokenInfo.Symbol);

            if (action == null) {
                return new Model.GramerInfo(Model.GramerInfoState.Error, tokenInfo);
            } else {
                if (action.ActionType == Model.ActionType.Shift) {
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Shift, tokenInfo);
                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState, Model.GramerInfo>(action.TargetState, gramerSymbol));

                    return gramerSymbol;
                } else if (action.ActionType == Model.ActionType.Reduce) {
                    var produce = action.TargetRule;
                    var prodSymbolCount = produce.SymbolGroup.Count();

                    var group = Loop.For(prodSymbolCount)
                        .Select(item => this._GrammerGroup.Remove())
                        .Reverse()
                        .ToList();
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Reduce,
                        group.Count() > 0
                        ? group.Get(0).Item2.StartToken
                        : new Model.TokenInfo(Model.TokenInfoState.Accept,
                            null,
                            null,
                            tokenInfo.Index,
                            tokenInfo.Line,
                            tokenInfo.Col));
                    gramerSymbol.SetChildGroup($.Enumerable.From(group.ToArray()).Select(item => item.Item2).ToList());
                    gramerSymbol.Value = $.Enumerable.From(group.ToArray())
                        .Select(item => item.Item2.Value)
                        .ToArray()
                        .join("");
                    gramerSymbol.Symbol = produce.NonTerminal;
                    gramerSymbol.Produce = produce;

                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState,
                            Model.
                            GramerInfo>(this._GrammerGroup.Get().Item1.GetAction(produce.NonTerminal).TargetState,
                            gramerSymbol));
                    return gramerSymbol;
                } else if (action.ActionType == Model.ActionType.Accept) {
                    var gramerInfo = this._GrammerGroup.Get().Item2;

                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Accept, tokenInfo);
                    gramerSymbol.SetChildGroup(new List<Model.GramerInfo>().Set(gramerInfo));
                    gramerSymbol.Value = gramerInfo.Value;
                    gramerSymbol.Data = gramerInfo.Data;

                    return gramerSymbol;
                } else {
                    throw "NotSupportedException";
                }
            }
        }

        GetGramerGroup(): List<Tuple<Model.LALRState, Model.GramerInfo>> {
            return $.Enumerable.From(this._GrammerGroup.ToArray()).ToList();
        }

        BackGramer(): Model.GramerInfo {
            var index = this.GetGramerGroup().Count() - 1;

            while (index>=1) {
                var gramer = this._GrammerGroup.Get(index).Item2;
                var state = this._GrammerGroup.Get(index).Item1;
                var preState = this._GrammerGroup.Get(index-1).Item1;

                if (gramer.Produce != null) {
                    break;
                }

                if ($.Enumerable.From(state.ActionGroup.ToArray()).Any(item => item.ActionType == Model.ActionType.Reduce)) {
                    break;
                }

                if ($.Enumerable.From(preState.ActionGroup.ToArray()).Any(item=>item.ActionType== Model.ActionType.Reduce)) {
                    var resultGramer = this.GetGramerGroup().Get().Item2;
                    this._GrammerGroup.Remove();
                    return resultGramer;
                }

                index--;
            }

            return null;
        }

        GetParentMaySymbolGroup(gramer: Model.GramerInfo): List<Model.Symbol> {
            var parentMaySymbolGroup = new List<Model.Symbol>();

            if (gramer.Parent != null) {
                parentMaySymbolGroup.Set(gramer.Parent.Symbol);
            } else {
                var index = $.Enumerable.From(this._GrammerGroup.ToArray())
                    .Select(item => item.Item2)
                    .IndexOf(gramer);

                while (index > 0) {
                    var preState = this._GrammerGroup.Get(index - 1).Item1;

                    parentMaySymbolGroup = $.Enumerable.From(preState.ActionGroup.ToArray())
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

        private  IsInOptionPro(grammer: Model.GramerInfo): boolean {
            var index = $.Enumerable.From(this._GrammerGroup.ToArray())
                .Select(item => item.Item2)
                .IndexOf(grammer);

            while (index>=1) {
                var gramer = this._GrammerGroup.Get(index).Item2;
                var state = this._GrammerGroup.Get(index).Item1;
                var preState = this._GrammerGroup.Get(index - 1).Item1;

                if (gramer.Produce != null) {
                    break;
                }


                if ($.Enumerable.From(state.ActionGroup.ToArray()).Any(item => item.ActionType == Model.ActionType.Reduce)) {
                    break;
                }
               
                if ($.Enumerable.From(preState.ActionGroup.ToArray())
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

        AutoComplete(): boolean {
            var grammer = this._GrammerGroup.Get().Item2;
            if (!this.IsInOptionPro(grammer)) {
                return false;
            }

            var index = this.GetIndex(grammer);  

            while (true) {
                var state = this._GrammerGroup.Get(index).Item1;
                var actionGroup = $.Enumerable.From(state.ActionGroup.ToArray());

                if (actionGroup.Any(item => item.ActionType == Model.ActionType.Reduce)) {
                    break;
                }

                var shift = actionGroup.First(item => item.ActionType == Model.ActionType.Shift);
                var tokenInfo = new Model.TokenInfo(Model.TokenInfoState.Accept, shift.Symbol, null, -1, -1, -1);

                this.ReadGramer(tokenInfo);
                index++;
            }

            return true;
        }
    }
}

namespace CodeEdit.LangAnaly {
    export class GramerReader {
        private _EgtManager: EgtManager;
        private _GrammerGroup: List<Tuple<Model.LALRState, Model.GramerInfo>> = new List<Tuple<Model.LALRState, Model.GramerInfo>>();

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
            }
            else {
                if (action.ActionType == Model.ActionType.Shift) {
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Shift, tokenInfo);
                    this._GrammerGroup.Set(new Tuple<Model.LALRState, Model.GramerInfo>(action.TargetState, gramerSymbol));

                    return gramerSymbol;
                }
                else if (action.ActionType == Model.ActionType.Reduce) {
                    var produce = action.TargetRule;
                    var prodSymbolCount = produce.SymbolGroup.Count();

                    var group = Loop.For(prodSymbolCount)
                        .Select(item => this._GrammerGroup.Remove())
                        .Reverse()
                        .ToList();
                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Reduce,
                        group.Count() > 0
                            ? group.Get(0).Item2.StartToken
                            : new Model.TokenInfo(Model.TokenInfoState.Accept, null, null, tokenInfo.Index, tokenInfo.Line,
                                tokenInfo.Col))
                    gramerSymbol.SetChildGroup($.Enumerable.From(group.ToArray()).Select(item => item.Item2).ToList());
                    gramerSymbol.Value = $.Enumerable.From(group.ToArray()).Select(item => item.Item2.Value).ToArray().join("");
                    gramerSymbol.Symbol = produce.NonTerminal;
                    gramerSymbol.Produce = produce;

                    this._GrammerGroup.Set(new Tuple<Model.LALRState, Model.GramerInfo>(this._GrammerGroup.Get().Item1.GetAction(produce.NonTerminal).TargetState, gramerSymbol));
                    return gramerSymbol;
                }
                else if (action.ActionType == Model.ActionType.Accept) {
                    var gramerInfo = this._GrammerGroup.Get().Item2;

                    var gramerSymbol = new Model.GramerInfo(Model.GramerInfoState.Accept, tokenInfo);
                    gramerSymbol.SetChildGroup(new List<Model.GramerInfo>().Set(gramerInfo));
                    gramerSymbol.Value = gramerInfo.Value;
                    gramerSymbol.Data = gramerInfo.Data;

                    return gramerSymbol;
                }
                else {
                    throw "NotSupportedException";
                }
            }
        }
    }
}
module CodeEdit.LangAnaly {
    export abstract class LangManagerBase {
        private _EgtManager: EgtManager;
        ContentNameGroup: List<string> = new List<string>();
        private _EroGrammerGroup:List<Model.GramerInfo>=new List<Model.GramerInfo>();

        constructor(egtStr: string) {
            this._EgtManager = EgtManager.CreateFromStr(egtStr);
        }

        GetValue(val: string): Object {
            var acceptGramer = this.Analy(val);
            return acceptGramer ? acceptGramer.Data : None;
        }

        Analy(val: string): Model.GramerInfo {
            this._EroGrammerGroup.Clear();

            var tokenReader = new TokenReader(this._EgtManager, val);
            var gramerReader = new GramerReader(this._EgtManager);
            
            while (true) {
                var token = tokenReader.ReadToken();
                this.TokenRead(token);

                if (token.Symbol == null || token.Symbol.Type != Model.SymbolType.Noise) {
                    while (true) {
                        var gramer = gramerReader.ReadGramer(token);
                       ;
                        if (gramer.GramerState == Model.GramerInfoState.Reduce) {
                            var gramerVal = val.substr(gramer.Index, token.Index - gramer.Index);

                            if (this.ContentNameGroup.Contains(gramer.Symbol.Name)) {
                                var preWhiteSpace = val.MatchPre("\\s+", gramer.Index - 1);

                                if (preWhiteSpace != null) {
                                    gramerVal = preWhiteSpace + gramerVal;
                                    var newPoint = val.PrePoint(preWhiteSpace.Length,
                                        new LinePoint(gramer.Index, gramer.Col, gramer.Line));
                                    gramer.Index = newPoint.Index;
                                    gramer.Line = newPoint.Y;
                                    gramer.Col = newPoint.X;
                                }
                                gramer.Value = gramerVal;
                            }
                            else {
                                gramerVal = gramerVal.trim();
                                gramer.Value = gramerVal;
                            }

                            this.GramerRead(gramer);
                        }
                        else if (gramer.GramerState == Model.GramerInfoState.Accept) {
                            this.GramerAccept(gramer);
                            return gramer.GetChildGroup().Get(0);
                       }
                        else if (gramer.GramerState == Model.GramerInfoState.Error) {
                            this._EroGrammerGroup.Set(gramer);
                        }

                        if (gramer.GramerState != Model.GramerInfoState.Reduce) {
                            break;
                        }
                    }
                }

                if (token.State == Model.TokenInfoState.End) {
                    break;
                }
            }

            console.log(this._EroGrammerGroup);

            return null;
        }

        TokenRead(tokenInfo: Model.TokenInfo) {

        }
        GramerRead(gramerInfo: Model.GramerInfo) {

        }
        GramerAccept(gramerInfo: Model.GramerInfo) {

        }
    }
}
module CodeEdit.LangAnaly {
    export abstract class LangManagerBase {
        private _EgtManager: EgtManager;
        protected _ResultGramerInfo: Model.GramerInfo;
        ContentNameGroup: List<string> = new List<string>();

        constructor(egtStr: string) {
            this._EgtManager = EgtManager.CreateFromStr(egtStr);
        }

        GetValue(val: string): Object {
            this.Analy(val);
            return this._ResultGramerInfo ? this._ResultGramerInfo.Data : None;
        }

        Analy(val: string) {
            this._ResultGramerInfo = null;

            var tokenReader = new TokenReader(this._EgtManager, val);
            var gramerReader = new GramerReader(this._EgtManager);

            while (true) {
                var token = tokenReader.ReadToken();
                this.TokenRead(token);

                if (token.Symbol == null || token.Symbol.Type != Model.SymbolType.Noise) {
                    while (true) {
                        var gramer = gramerReader.ReadGramer(token);

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
                            this._ResultGramerInfo = gramer;
                            this.GramerAccept(gramer);
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
        }

        TokenRead(tokenInfo: Model.TokenInfo) {

        }
        GramerRead(gramerInfo: Model.GramerInfo) {

        }
        GramerAccept(gramerInfo: Model.GramerInfo) {

        }
    }
}
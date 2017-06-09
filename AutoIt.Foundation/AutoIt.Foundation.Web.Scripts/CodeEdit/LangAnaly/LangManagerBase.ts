module CodeEdit.LangAnaly {
    export abstract class LangManagerBase {
        private _EgtManager: EgtManager;
        private _TokenReader: TokenReader;
        private _GramerReader:GramerReader;

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

            this._TokenReader = new TokenReader(this._EgtManager, val);
            this._GramerReader = new GramerReader(this._EgtManager);
           
            while (true) {
                var token = this._TokenReader.ReadToken();
                this.TokenRead(token);

                if (token.Symbol == null || token.Symbol.Type != Model.SymbolType.Noise) {
                    while (true) {
                        var gramer = this._GramerReader.ReadGramer(token);
                       
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
                            var resultGrammer = gramer.GetChildGroup().Get(0);

                            return resultGrammer;
                        } else if (gramer.GramerState == Model.GramerInfoState.Error) {
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

            //$.Enumerable.From(this._EroGrammerGroup.ToArray())
            //.ForEach(item => {
            //        console.log(item.Index + "," + item.Line + "-" + item.Col + ":" + item.Value);
            //    });
            //console.log();

            return null;
        }

        GetGramerInfo(line: number, col: number): Model.GramerInfo {
           var grammer= $.Enumerable.From(this._EroGrammerGroup.ToArray())
                .FirstOrDefault(null, item => item.Line == line && item.Col == col);

            if (grammer == null) {
                var grammerGroup = $.Enumerable.From(this._GramerReader.GetGramerGroup().ToArray()).ToList();

                while (grammerGroup.Count() > 0) {
                    var item = grammerGroup.Remove(0);
                    var itemChildGroup = item.GetChildGroup();

                    if (itemChildGroup.Count()>0) {
                        grammerGroup.SetRange(itemChildGroup);
                    }
                    else if (item.Line == line && item.Col == col && item.Value) {
                        grammer = item;
                        return grammer;
                    }
                }
            }

            return grammer;
        }

        TokenRead(tokenInfo: Model.TokenInfo) {

        }
        GramerRead(gramerInfo: Model.GramerInfo) {

        }
        GramerAccept(gramerInfo: Model.GramerInfo) {

        }
    }
}
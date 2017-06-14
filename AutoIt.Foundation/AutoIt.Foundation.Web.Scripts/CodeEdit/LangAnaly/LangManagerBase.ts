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
                console.log(token);
                if (token.Symbol == null || token.Symbol.Type != Model.SymbolType.Noise) {
                    while (true) {
                        var gramer = this._GramerReader.ReadGramer(token);
                        console.log(gramer);
                        if (gramer.GramerState == Model.GramerInfoState.Reduce) {
                            var gramerVal = val.substr(gramer.Index, token.Index - gramer.Index);

                            if (this.ContentNameGroup.Contains(gramer.Symbol.Name)) {                 
                                var preWhiteSpace = val.MatchPre("^\\s+", gramer.Index - 1);
                             
                                if (preWhiteSpace != null) {
                                    gramerVal = preWhiteSpace + gramerVal;
                                    var newPoint = val.PrePoint(preWhiteSpace.length,
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
                            //console.log(this._GramerReader.GetGramerGroup());

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
                    //console.log(this._GramerReader.GetGramerGroup());
                    break;
                }
            }

            //$.Enumerable.From(this._EroGrammerGroup.ToArray())
            //.ForEach(item => {
            //        console.log(item.Index + "," + item.Line + "-" + item.Col + ":" + item.Value);
            //    });
           

            return null;
        }

        GetGramerAnalyInfo(line: number, col: number): Model.GramerAnalyInfo {
           var grammer= $.Enumerable.From(this._EroGrammerGroup.ToArray())
                .FirstOrDefault(null, item => item.Line == line && item.Col == col);

            if (grammer != null) {
                return new Model.GramerAnalyInfo(grammer, new List<Model.Symbol>());
            } else {
               // debugger;
                var grammerWithStateGroup = this._GramerReader.GetGramerGroup();
                var grammerGroup = $.Enumerable.From(grammerWithStateGroup.ToArray())
                    .Where(item => item.Item2 != null)
                    .Select(item => item.Item2)
                    .ToList();

                while (grammerGroup.Count() > 0) {
                    var item = grammerGroup.Remove(0);

                    var itemChildGroup = item.GetChildGroup();
                 
                    if (itemChildGroup.Count() > 0 && this.ContentNameGroup.Index(item.Symbol.Name) < 0) {
                        grammerGroup.SetRange(itemChildGroup);
                    }
                    else if (item.Contains(line, col) && item.Value) {//item.Line == line && item.Col == col 
                        grammer = item;

                        var parentMaySymbolGroup = new List<Model.Symbol>();

                        if (grammer.Parent != null) {
                            parentMaySymbolGroup.Set(grammer.Parent.Symbol);
                        } else {
                            var index = $.Enumerable.From(grammerWithStateGroup.ToArray())
                                .Select(item => item.Item2)
                                .IndexOf(grammer);

                            while (index>0) {
                                var lalrState = grammerWithStateGroup.Get(index - 1).Item1;

                                parentMaySymbolGroup = $.Enumerable.From(lalrState.ActionGroup.ToArray())
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

                        return new Model.GramerAnalyInfo(grammer, parentMaySymbolGroup);
                    }
                }
            }

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
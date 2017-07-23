var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        //语法分析基类
        var LangAnalyBase = (function () {
            function LangAnalyBase(egtStr) {
                //内容符号名称列表
                this.ContentNameGroup = new List();
                //块开始名称列表
                this.BlockStartNameGroup = new List();
                this._EgtStorer = LangAnaly.EgtStorer.CreateFromStr(egtStr);
            }
            //获取值(文本)
            LangAnalyBase.prototype.GetValue = function (val) {
                var acceptGramer = this.Analy(val);
                return acceptGramer ? acceptGramer.Data : None;
            };
            //分析(文本):
            LangAnalyBase.prototype.Analy = function (val) {
                //构造Reader
                this._TokenReader = new LangAnaly.TokenReader(this._EgtStorer, val);
                this._GramerReader = new LangAnaly.GramerReader(this._EgtStorer);
                while (true) {
                    //读取一个符号
                    var token = this._TokenReader.ReadToken();
                    this.TokenRead(token);
                    //不处理可忽略的符号
                    if (!token.IsNoise()) {
                        //消耗符号
                        while (true) {
                            //读取语法
                            var gramer = this._GramerReader.ReadGramer(token);
                            //如果是规约,重新计算文本
                            if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Reduce) {
                                //文本从语法的索引开始到后面符号的索引结束(空字符)
                                var gramerVal = gramer.Index >= 0 ? val.substr(gramer.Index, token.Index - gramer.Index) : "";
                                //如果是内容符号,则还要包括前面的空白
                                if (this.ContentNameGroup.Contains(gramer.Symbol.Name)) {
                                    //从语法或 符号的开始索引之前查找 
                                    var index = gramer.Index >= 0 ? gramer.Index : token.Index;
                                    var preWhiteSpace = val.MatchPre("^\\s+", index - 1);
                                    //如果前面有空白,则重新定位
                                    if (preWhiteSpace != null) {
                                        gramerVal = preWhiteSpace + gramerVal;
                                        var newPoint = val.PrePoint(new LinePoint(token.Index, token.Col, token.Line), gramerVal.length);
                                        gramer.Index = newPoint.Index;
                                        gramer.Line = newPoint.Y;
                                        gramer.Col = newPoint.X;
                                        gramer.StartToken.Index = gramer.Index;
                                        gramer.StartToken.Col = gramer.Col;
                                        gramer.StartToken.Line = gramer.Line;
                                    }
                                    gramer.Value = gramerVal;
                                }
                                else {
                                    gramerVal = gramerVal.trim();
                                    gramer.Value = gramerVal;
                                }
                                //如果语义错误,则撤回语法并设置为错误
                                if (!this.IsGramerMeanEro(gramer)) {
                                    this._GramerReader.BackGrammer();
                                }
                                else {
                                    this.GramerRead(gramer);
                                }
                                //Reduce时继续处理当前Token
                                continue;
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Accept) {
                                this.GramerAccept(gramer);
                                //根语法为Accept语法的第一个子语法
                                var resultGrammer = gramer.GetChildGroup().Get(0);
                                return resultGrammer;
                            }
                            else if (gramer.GramerState == LangAnaly.Model.GramerInfoState.Error) {
                                //如果是块开始元素,则撤销前面的语法(直至正确为止)
                                var autoMust = gramer.Symbol != null &&
                                    (this.BlockStartNameGroup.Contains(gramer.Symbol.Name) || token.Symbol.Name == "EOF");
                                //尝试补全语法
                                var isAutoComplete = this._GramerReader.AutoComplete(!autoMust);
                                if (isAutoComplete) {
                                    //继续消耗字符
                                    continue;
                                }
                                else {
                                    this._GramerReader.SetEroGramer(gramer);
                                }
                            }
                            break;
                        }
                    }
                    //遇到结束符号则停止分析
                    if (token.State == LangAnaly.Model.TokenInfoState.End) {
                        break;
                    }
                }
                return null;
            };
            //获取指定位置的分析信息(行,列)     
            LangAnalyBase.prototype.GetAnalyInfo = function (line, col) {
                //如果位于语法树中,则返回语法信息和可能的父符号
                var grammer = this._GramerReader.GetGrammerInfo(line, col, this.ContentNameGroup);
                if (grammer != null) {
                    return new LangAnaly.Model.GramerAnalyInfo(grammer);
                }
                return null;
            };
            //语法
            LangAnalyBase.prototype.IsGramerMeanEro = function (gramerInfo) {
                return true;
            };
            //读到符号(符号)
            LangAnalyBase.prototype.TokenRead = function (tokenInfo) {
            };
            //读到语法(语法)
            LangAnalyBase.prototype.GramerRead = function (gramerInfo) {
            };
            //语法被接受
            LangAnalyBase.prototype.GramerAccept = function (gramerInfo) {
            };
            return LangAnalyBase;
        }());
        LangAnaly.LangAnalyBase = LangAnalyBase;
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

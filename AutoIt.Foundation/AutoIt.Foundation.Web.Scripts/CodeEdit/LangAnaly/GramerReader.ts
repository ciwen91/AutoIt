﻿
namespace CodeEdit.LangAnaly {
    //从标记流中读取语法信息
    export class GramerReader {
        //Egt信息
        private _EgtStorer: EgtStorer;
        //语法堆栈(下一个状态,当前语法)
         _GrammerGroup: List<Tuple<Model.LALRState, Model.GramerInfo>> = new
            List<Tuple<Model.LALRState, Model.GramerInfo>>();

        constructor(egtStorer: EgtStorer) {
            this._EgtStorer = egtStorer;

            var topInfo = new Tuple<Model.LALRState, Model.GramerInfo>(egtStorer.LALRStateGroup.Get(0), null);
            this._GrammerGroup.Set(topInfo);
        }

        //读取语法(符号)
        ReadGramer(tokenInfo: Model.TokenInfo): Model.GramerInfo {
            //当前状态
            var curState = this.GetCurState();
            //符号对应的动作
            var action = curState.GetAction(tokenInfo.Symbol);

            //没有对应的动作则返回语法错误
            if (action == null) {
                var gramer = new Model.GramerInfo(Model.GramerInfoState.Error, tokenInfo);
                return gramer;
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
                    var group = new List<Tuple<Model.LALRState, Model.GramerInfo>>();
                    var i = 0;
                    while (i < prodSymbolCount) {
                        var info = this._GrammerGroup.Remove();
                        group.Set(info);

                        if (info.Item2.GramerState != Model.GramerInfoState.Error) {
                            i++;
                        }
                    }
                    group = group.ToEnumerble().Reverse().ToList();

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
                    var targetState = this.GetCurState().GetAction(produce.NonTerminal).TargetState;
                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState,
                            Model.
                            GramerInfo>(targetState,
                            gramerSymbol));
                    return gramerSymbol;
                }
                //跳转
                else if (action.ActionType == Model.ActionType.Goto) {
                    var gramerSymbol = new LangAnaly.Model.GramerInfo(LangAnaly.Model.GramerInfoState.Reduce, tokenInfo);

                    this._GrammerGroup
                        .Set(new Tuple<Model.LALRState,
                            Model.
                            GramerInfo>(action.TargetState,
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

        //获取指定位置的语法信息(行,列,内容符号名称列表)
        GetGrammerInfo(line: number, col: number, contentNameGroup: List<string>): Model.GramerInfo {
            //初始列表为顶级语法列表
            var group = this._GrammerGroup.ToEnumerble()
                .Where(item => item.Item2 != null)
                .Select(item => item.Item2)
                .ToList();

            while (group.Count() > 0) {
                var item = group.Remove(0);
                var itemChildGroup = item.GetChildGroup();

                //寻找匹配的叶子节点(没有子节点或内容节点)
                if ((itemChildGroup.Count() == 0 || item.GramerState== Model.GramerInfoState.Error|| contentNameGroup.Index(item.Symbol.Name) >= 0) &&
                    item.Value &&
                    item.Contains(line, col)) {
                    return item;
                }
                //非叶子节点则将子节点加入队列
                else if (itemChildGroup.Count() > 0) {
                    group.SetRange(itemChildGroup);
                }
            }

            return null;
        }

        //自动补全不完整的语法(是否只补全可选的)
        AutoComplete(onlyOption: boolean = false): boolean {
            //当前语法
            var grammer = this._GrammerGroup.Get().Item2;

              //空的(最开始)、错误的的不补全
            if (grammer == null ||
                grammer.GramerState == Model.GramerInfoState.Error) {
                return false;
            }

            //对于补全可选的,完整的,非可选的不补全
            if (onlyOption && (this.IsComplete(grammer) || !this.IsInOptionPro(grammer))) {
                return false;
            }
         
            var index = 0;

            //从当前状态开始不断移入节点,直到可以规约(根据语法信息)
            while (true) {
                //当前状态堆栈(不包含错误元素)
                var stateGroup = this._GrammerGroup.ToEnumerble()
                    .Where(item => item.Item2 == null || item.Item2.GramerState != Model.GramerInfoState.Error)
                    .Select(item => item.Item1)
                    .ToList();
                var curState = stateGroup.Get();

                 //可以完成的不补全
                if (curState.CanAccept()) {
                    break;
                }

                //第二次Reduce则停止???
                if (index > 0 && curState.CanReduce()) {
                    break;
                }

                //寻找第一个移入类的符号
                var sym = curState.GetNextSymbol(stateGroup, this._EgtStorer.ProduceGroup);
                //构造移入符号并读入符号(坐标为-1是为了不干扰定位)
                var tokenInfo = new Model.TokenInfo(Model.TokenInfoState.Accept, sym, null, -1, -1, -1);
                console.log(sym);

                //如果是规约,则持续消耗符号
                while (true) {
                    var grm = this.ReadGramer(tokenInfo);
                    if (grm.GramerState != Model.GramerInfoState.Reduce) {
                        break;
                    }
                }

                index++;
            }

            if (index == 0) {
                return false;
            } else {
                //状态为自动补全
                grammer.GramerState = Model.GramerInfoState.AutoComplete;
                return true;
            }

        }

        //语法是否完成
        private IsComplete(grammer: Model.GramerInfo): boolean {
            //如果语法有产生式则为已完成
            if (grammer.Produce != null) {
                return true;
            }

            var index = this.GetIndex(grammer);
            var state = this._GrammerGroup.Get(index).Item1;

            //如果当前状态有Reduce动作,则为已完成(说明当前状态可以Reduce,错误是由后面的字符导致的)
            if (state.ActionGroup.ToEnumerble()
                .Any(item => item.ActionType == Model.ActionType.Reduce)) {
                return true;
            }

            return false;
        }

        //是否式可选的语法
        private IsInOptionPro(gramer: Model.GramerInfo): boolean {
            var index = this.GetIndex(gramer);

            //从上一个状态开始,如果能找的Reduce动作则不是必须的(说明可以不经过当前状态而Reduce)
            while (index > 0) {
                var info = this._GrammerGroup.Get(index - 1);
                var preGramer = info.Item2;

                if (preGramer != null && preGramer.GramerState != Model.GramerInfoState.Error) {
                    var preState = info.Item1;
                    if (preState.ActionGroup.ToEnumerble()
                        .Any(item => item.ActionType == Model.ActionType.Reduce)) {
                        return true;
                    }
                }

                index--;
            }

            return false;
        }

        //获取最近的语法(过滤函数)
        GetClosetGrammer(whereFunc: FuncOne<Model.GramerInfo, boolean>, gramer: Model.GramerInfo = null): Model.
            GramerInfo {
            var group = this._GrammerGroup.ToEnumerble().Select(item=>item.Item2);

            if (gramer != null) {
                if (gramer.Parent != null) {
                    group = gramer.Parent.GetChildGroup().ToEnumerble();
                }

                var index = group.IndexOf(gramer);
                group = group.Where((item, i) => i <= index);
            }

            var result = group
                .Where(item=>item != null &&
                    item.GramerState != Model.GramerInfoState.Error)
                .Reverse()  
                .FirstOrDefault(null, whereFunc);
            return result;
        }

        //设置错误语法(语法)
        SetEroGramer(grammer: Model.GramerInfo): GramerReader {
            var index = this._GrammerGroup.Count() - 1;
            var preACGrammer: Model.GramerInfo = null;
            var preACState: Model.LALRState = null;

            //找到最前的补全元素
            while (index > 0) {
                var preGrammer = this._GrammerGroup.Get(index).Item2;

                if (preGrammer.Index >= 0) {
                    break;
                }
                else {
                    preACGrammer = preGrammer;
                    preACState = this._GrammerGroup.Get(index).Item1;
                }

                index--;
            }

            //如果存在补全元素,且错误语法为补全元素的一部分,则设置可能的父元素
            if (preACGrammer != null && grammer.Value) {
                var maySymbolGroup = this._EgtStorer.DFAStateGroup.Get(0)
                    .GetMayAcceptSymbolGroup(grammer.Value);
                if (maySymbolGroup.Contains(preACGrammer.Symbol)) {
                    //如果补全元素有父元素则设置为可能的父元素
                    if (preACGrammer.Parent != null) {
                        grammer.MayParent = preACGrammer;
                    }
                    else {
                        //否则根据补全元素的LALR状态获取可能的父元素
                        var group = new List<Model.Symbol>([preACGrammer.Symbol]);
                        group.SetRange(preACState.GetMayParentSymbolGroup());
                        grammer.MayParentSymbolGroup = group;
                    }
                }
            }

            //将错误语法加到堆栈中
            this._GrammerGroup.Set(new Tuple(<Model.LALRState>None, grammer));

            return this;
        }

        //撤销语法
        BackGrammer(): Model.GramerInfo {
            //将当前语法设置为错误
            var result = this._GrammerGroup.ToEnumerble()
                .Where(item => item.Item2 != null)
                .Select(item => item.Item2)
                .Last(item => item.GramerState != Model.GramerInfoState.Error);
            result.GramerState = Model.GramerInfoState.Error;

            var index = this._GrammerGroup.Count() - 2;
             //去除前面空值语法(是由当前撤销语法带来的)
            while (index > 0) {
                var gramer = this._GrammerGroup.Get(index).Item2;
                if (gramer != null && !gramer.Value) {
                    gramer.GramerState = Model.GramerInfoState.Error;
                } else {
                    break;
                }
                index--;
            }

            return result;
        }
       
        //获取当前状态
        private GetCurState():Model.LALRState {
            return this._GrammerGroup.ToEnumerble()
                .Last(item => item.Item2 == null || item.Item2.GramerState != Model.GramerInfoState.Error)
                .Item1;
        }

        //获取语法在栈中的位置(语法)
        private GetIndex(grammer: Model.GramerInfo): number {
            var index = this._GrammerGroup.ToEnumerble()
                .Select(item => item.Item2)
                .IndexOf(grammer);

            return index;
        }

    }
}

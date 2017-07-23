var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //LALR״̬
            var LALRState = (function (_super) {
                __extends(LALRState, _super);
                function LALRState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //�����б�
                    _this.ActionGroup = new List();
                    _this._MayParentSymbolGroup = null;
                    return _this;
                    //#endregion
                }
                //��ȡ����(����)
                LALRState.prototype.GetAction = function (symbol) {
                    var action = this.ActionGroup.ToEnumerble().FirstOrDefault(null, function (item) { return item.Symbol == symbol; });
                    return action;
                };
                //��ȡ���ܵĸ�����
                LALRState.prototype.GetMayParentSymbolGroup = function () {
                    //��������,��ֱ�ӷ���
                    if (this._MayParentSymbolGroup != null) {
                        return this._MayParentSymbolGroup;
                    }
                    else {
                        var group = this.GetMayParentSymbolGroup$(1, new List());
                        group = group.ToEnumerble().Distinct().ToList();
                        this._MayParentSymbolGroup = group;
                        return group;
                    }
                };
                //��ȡ���ܵĸ�����
                LALRState.prototype.GetMayParentSymbolGroup$ = function (deep, visitedStateGroup) {
                    //������ʹ��򷵻�,�����Ƿ��ʹ�
                    if (visitedStateGroup.Contains(this)) {
                        return new List();
                    }
                    else {
                        visitedStateGroup.Set(this);
                    }
                    //�ҵ����е���ȴ��ڵ��ڵ�ǰ��ȵĹ�ԼԪ��
                    var curGroup = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item
                        .ActionType ==
                        Model.ActionType.Reduce &&
                        item.TargetRule.SymbolGroup.Count() >= deep; })
                        .Select(function (item) { return item.TargetRule.NonTerminal; })
                        .ToList();
                    //���������GoToԪ��,�ҵ����+1�ĸ�Ԫ��
                    var mayGroup = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Shift || item.ActionType == Model.ActionType.Goto; })
                        .SelectMany(function (item) { return item.TargetState.GetMayParentSymbolGroup$(deep + 1, visitedStateGroup).ToArray(); })
                        .ToList();
                    var resultGroup = curGroup.SetRange(mayGroup);
                    return resultGroup;
                };
                //#region ���������׹�Լ�ķ���
                //��ȡ���������׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬,���в���ʽ)
                LALRState.prototype.GetNextSymbol = function (stateGroup, allProduce) {
                    var sym = null;
                    //��ȡ��ԼԪ��(���׹�Լ)
                    if (sym == null) {
                        sym = this.GetNextReduceSymbol(stateGroup);
                    }
                    //��ȡGoToԪ��(��������ʱһ�����Һ���ѭ��,���뱾��Ҳ��װ��ΪGoTo)
                    if (sym == null) {
                        sym = this.GetNextGotoSymbol(allProduce);
                    }
                    //��ȡ����Ԫ��
                    if (sym == null) {
                        sym = this.GetNextShiftSymbol();
                    }
                    return sym;
                };
                //��ȡ�����׹�Լ�ķ���(��ǰ״̬��ջ:��������״̬)
                LALRState.prototype.GetNextReduceSymbol = function (stateGroup) {
                    var resultReduceGroup = new List();
                    //���Ϲ�Լ,ֱ�����ܹ�Լ
                    while (true) {
                        var curState = stateGroup.Get();
                        var reduceGroup = curState.GetActionGroup(Model.ActionType.Reduce);
                        if (reduceGroup.Count() < 1) {
                            break;
                        }
                        resultReduceGroup = reduceGroup;
                        LALRState.Reduce(stateGroup);
                    }
                    //ȡ��һ����Լ����Ԫ��
                    var sym = resultReduceGroup.ToEnumerble()
                        .Select(function (item) { return item.Symbol; })
                        .FirstOrDefault(null);
                    return sym;
                };
                //��ȡ��������ת�ķ���(���в���ʽ)
                LALRState.prototype.GetNextGotoSymbol = function (allProduce) {
                    //���ݲ���ʽ�Ĺ�ϵ,��ȡ��ת���Ĳ���ʽ
                    var sym = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Goto; })
                        .OrderByCompareFunc(function (a, b) { return Model.Produce.Compare(a.Symbol, b.Symbol, allProduce); })
                        .Select(function (item) { return item.Symbol; })
                        .FirstOrDefault(null);
                    return sym;
                };
                //��ȡ����������ķ���
                LALRState.prototype.GetNextShiftSymbol = function () {
                    //��ȡ���һ���������
                    var sym = this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == Model.ActionType.Shift; })
                        .Select(function (item) { return item.Symbol; })
                        .LastOrDefault(null);
                    return sym;
                };
                //#endregion
                //#reginon ��������
                //��Լ(��ǰ״̬��ջ:����������״̬)
                LALRState.Reduce = function (stateGroup) {
                    var curState = stateGroup.Get();
                    //������ܹ�Լ����false
                    if (!curState.CanReduce()) {
                        return false;
                    }
                    else {
                        var produce = curState.GetProduce();
                        var cnt = produce.SymbolGroup.Count();
                        //����������Ÿ���״̬
                        while (cnt > 0) {
                            stateGroup.Remove();
                            cnt--;
                        }
                        //ִ��GoTo��ת
                        var state = stateGroup.Get();
                        var nextState = state.GetAction(produce.NonTerminal).TargetState;
                        stateGroup.Set(nextState);
                        return true;
                    }
                };
                //�Ƿ���Խ���
                LALRState.prototype.CanAccept = function () {
                    var canAccept = this.ActionGroup.ToEnumerble().Any(function (item) { return item.Symbol.Name == "EOF"; });
                    return canAccept;
                };
                //�Ƿ���Թ�Լ
                LALRState.prototype.CanReduce = function () {
                    var canReduce = this.ActionGroup.ToEnumerble().Any(function (item) { return item.ActionType == Model.ActionType.Reduce; });
                    return canReduce;
                };
                //��ȡ����ʽ
                LALRState.prototype.GetProduce = function () {
                    var actionGroup = this.GetActionGroup(Model.ActionType.Reduce);
                    var produce = actionGroup.Count() > 0 ? actionGroup.Get(0).TargetRule : null;
                    return produce;
                };
                //��ȡָ�����Ͷ�������(��������)
                LALRState.prototype.GetActionGroup = function (typ) {
                    return this.ActionGroup.ToEnumerble()
                        .Where(function (item) { return item.ActionType == typ; })
                        .ToList();
                };
                return LALRState;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.LALRState = LALRState;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

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
            //DFA״̬
            var DFAState = (function (_super) {
                __extends(DFAState, _super);
                function DFAState() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    //�߼���
                    _this.EdgGroup = new List();
                    return _this;
                }
                //��ȡƥ��ı�(�ַ�)
                DFAState.prototype.GetEdge = function (cha) {
                    var edge = $.Enumerable.From(this.EdgGroup.ToArray())
                        .FirstOrDefault(null, function (item) { return item.IsFit(cha); });
                    return edge;
                };
                //��ȡ���ܽ��ܵķ���(�ַ���,���ʹ���״̬)
                DFAState.prototype.GetMayAcceptSymbolGroup = function (str, visiteStateGroup) {
                    if (visiteStateGroup === void 0) { visiteStateGroup = new List(); }
                    var group = new List();
                    //������ʹ��򷵻�,������
                    if (visiteStateGroup.Contains(this)) {
                        return group;
                    }
                    else {
                        visiteStateGroup.Set(this);
                    }
                    //����ַ�������Ϊ0,����ƥ��
                    if (str.length > 0) {
                        var edge = this.GetEdge(str[0]);
                        //ƥ��ʧ��ֱ�ӷ���
                        if (edge == null) {
                            return group;
                        }
                        else {
                            return edge.TargetState.GetMayAcceptSymbolGroup(str.substr(1), visiteStateGroup);
                        }
                    }
                    else {
                        //��ǰ״̬�Ŀɽ��ܵķ���
                        if (this.AcceptSymbol != null) {
                            group.Set(this.AcceptSymbol);
                        }
                        //����״̬�Ŀɽ��ܵķ���
                        var nextGroup = this.EdgGroup.ToEnumerble()
                            .SelectMany(function (item) { return item.TargetState.GetMayAcceptSymbolGroup(str, visiteStateGroup).ToArray(); })
                            .ToList();
                        group.SetRange(nextGroup);
                        group = group.ToEnumerble().Distinct().ToList();
                        return group;
                    }
                };
                return DFAState;
            }(CodeEdit.LangAnaly.Model.EgtEntityBase));
            Model.DFAState = DFAState;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="SymbolInfoBase.ts"/>>
var CodeEdit;
(function (CodeEdit) {
    var LangAnaly;
    (function (LangAnaly) {
        var Model;
        (function (Model) {
            //�﷨��Ϣ
            var GramerInfo = (function (_super) {
                __extends(GramerInfo, _super);
                function GramerInfo(gramerState, startToken) {
                    var _this = _super.call(this, startToken.Symbol, startToken.Value, startToken.Line, startToken.Col, startToken.Index) || this;
                    //����ʽ
                    _this.Produce = null;
                    //���﷨����
                    _this._ChildGroup = new List();
                    _this.MayParent = null;
                    _this.MayParentSymbolGroup = new List();
                    _this.GramerState = gramerState;
                    _this.StartToken = startToken;
                    _this.Data = startToken.Data;
                    return _this;
                }
                //��ȡ���п��ܵĸ�����(��ǰ�﷨)
                GramerInfo.prototype.GetParentMaySymbolGroup = function () {
                    var parentMaySymbolGroup = new List();
                    //����и��﷨,��Ϊ���﷨�ķ���
                    if (this.Parent != null && this.GramerState != Model.GramerInfoState.Error) {
                        var parentGramer = this.Parent;
                        while (parentGramer != null) {
                            parentMaySymbolGroup.Set(parentGramer.Symbol);
                            parentGramer = parentGramer.Parent;
                        }
                    }
                    else if (this.MayParent != null) {
                        var parentGramer = this.MayParent;
                        while (parentGramer != null) {
                            parentMaySymbolGroup.Set(parentGramer.Symbol);
                            parentGramer = parentGramer.Parent;
                        }
                    }
                    else {
                        parentMaySymbolGroup = this.MayParentSymbolGroup;
                    }
                    return parentMaySymbolGroup;
                };
                //��ȡ���﷨
                GramerInfo.prototype.GetChildGroup = function () {
                    return this._ChildGroup;
                };
                //�������﷨
                GramerInfo.prototype.SetChildGroup = function (childGroup) {
                    var _this = this;
                    this._ChildGroup = childGroup;
                    this._ChildGroup.ToEnumerble()
                        .ForEach(function (item) { return item.Parent = _this; });
                };
                //��ȡ�﷨�㼶
                GramerInfo.prototype.GetLevel = function () {
                    if (this.Produce == null) {
                        return -1;
                    }
                    else if (this._ChildGroup.Count() == 0) {
                        return 0;
                    }
                    else {
                        return this._ChildGroup.ToEnumerble().Max(function (item) { return item.GetLevel() + 1; });
                    }
                };
                //��һ��λ��(�ַ���)
                GramerInfo.prototype.NextPoint = function (val) {
                    var nextPoint = val.NextPoint(this.EndLinePoint(), 1);
                    return nextPoint;
                };
                return GramerInfo;
            }(CodeEdit.LangAnaly.Model.SymbolInfoBase));
            Model.GramerInfo = GramerInfo;
        })(Model = LangAnaly.Model || (LangAnaly.Model = {}));
    })(LangAnaly = CodeEdit.LangAnaly || (CodeEdit.LangAnaly = {}));
})(CodeEdit || (CodeEdit = {}));

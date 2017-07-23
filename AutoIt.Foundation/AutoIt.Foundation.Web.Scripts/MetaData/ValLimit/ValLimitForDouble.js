var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="ValLimitForInt.ts"/>
var MetaData;
(function (MetaData) {
    var ValLimitForDouble = (function (_super) {
        __extends(ValLimitForDouble, _super);
        function ValLimitForDouble(min, max, fraction, parttern) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            if (fraction === void 0) { fraction = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, min, max, parttern) || this;
            _this.Fraction = fraction;
            return _this;
        }
        return ValLimitForDouble;
    }(MetaData.ValLimitForInt));
    MetaData.ValLimitForDouble = ValLimitForDouble;
})(MetaData || (MetaData = {}));

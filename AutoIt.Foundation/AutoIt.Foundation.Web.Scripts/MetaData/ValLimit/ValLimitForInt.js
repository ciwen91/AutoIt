var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MetaData;
(function (MetaData) {
    var ValLimitForInt = (function (_super) {
        __extends(ValLimitForInt, _super);
        function ValLimitForInt(min, max, parttern) {
            if (min === void 0) { min = null; }
            if (max === void 0) { max = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, parttern) || this;
            _this.Min = min;
            _this.Max = max;
            return _this;
        }
        return ValLimitForInt;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForInt = ValLimitForInt;
})(MetaData || (MetaData = {}));

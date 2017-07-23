var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MetaData;
(function (MetaData) {
    var ValLimitForStr = (function (_super) {
        __extends(ValLimitForStr, _super);
        function ValLimitForStr(minLength, maxLength, parttern) {
            if (minLength === void 0) { minLength = null; }
            if (maxLength === void 0) { maxLength = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, parttern) || this;
            _this.MinLength = minLength;
            _this.MaxLength = maxLength;
            return _this;
        }
        return ValLimitForStr;
    }(MetaData.ValLimitBase));
})(MetaData || (MetaData = {}));

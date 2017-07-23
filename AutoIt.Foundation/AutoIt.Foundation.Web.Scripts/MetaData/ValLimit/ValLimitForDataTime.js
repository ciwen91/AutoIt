var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MetaData;
(function (MetaData) {
    var ValLimitForDataTime = (function (_super) {
        __extends(ValLimitForDataTime, _super);
        function ValLimitForDataTime(type, format, parttern) {
            if (type === void 0) { type = null; }
            if (format === void 0) { format = null; }
            if (parttern === void 0) { parttern = null; }
            var _this = _super.call(this, parttern) || this;
            _this.Type = type;
            _this.Format = format;
            return _this;
        }
        return ValLimitForDataTime;
    }(MetaData.ValLimitBase));
    MetaData.ValLimitForDataTime = ValLimitForDataTime;
})(MetaData || (MetaData = {}));

var MetaData;
(function (MetaData) {
    var AtrInfo = (function () {
        function AtrInfo(name, type, required, valLimit) {
            if (required === void 0) { required = true; }
            if (valLimit === void 0) { valLimit = null; }
            this.Name = name;
            this.Type = type;
            this.Required = required;
            this.ValLimit = valLimit;
        }
        return AtrInfo;
    }());
    MetaData.AtrInfo = AtrInfo;
})(MetaData || (MetaData = {}));

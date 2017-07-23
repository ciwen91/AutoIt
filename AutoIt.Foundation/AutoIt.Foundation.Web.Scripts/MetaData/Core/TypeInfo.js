var MetaData;
(function (MetaData) {
    var TypeInfo = (function () {
        function TypeInfo(name, base) {
            if (base === void 0) { base = null; }
            this.Name = name;
            this.Base = base;
        }
        TypeInfo.prototype.GetAttrGroup = function () {
            var group = this.Base.GetAttrGroup();
            group.SetRange(this.AtrGroup);
            return group;
        };
        TypeInfo.prototype.GetElmGroup = function () {
            var group = this.Base.GetElmGroup();
            group.SetRange(this.ElmGroup);
            return group;
        };
        return TypeInfo;
    }());
    MetaData.TypeInfo = TypeInfo;
})(MetaData || (MetaData = {}));

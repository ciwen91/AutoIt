var MetaData;
(function (MetaData) {
    var ElmInfo = (function () {
        function ElmInfo(name, type) {
            this.Name = name;
            this.Type = type;
        }
        return ElmInfo;
    }());
    MetaData.ElmInfo = ElmInfo;
})(MetaData || (MetaData = {}));

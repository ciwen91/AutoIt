var MetaData;
(function (MetaData) {
    var SimpleType;
    (function (SimpleType) {
        SimpleType[SimpleType["string"] = 0] = "string";
        SimpleType[SimpleType["byte"] = 1] = "byte";
        SimpleType[SimpleType["int"] = 2] = "int";
        SimpleType[SimpleType["long"] = 3] = "long";
        SimpleType[SimpleType["double"] = 4] = "double";
        SimpleType[SimpleType["bool"] = 5] = "bool";
        SimpleType[SimpleType["datetime"] = 6] = "datetime";
        SimpleType[SimpleType["date"] = 7] = "date";
        SimpleType[SimpleType["time"] = 8] = "time";
        SimpleType[SimpleType["enum"] = 9] = "enum";
    })(SimpleType = MetaData.SimpleType || (MetaData.SimpleType = {}));
})(MetaData || (MetaData = {}));

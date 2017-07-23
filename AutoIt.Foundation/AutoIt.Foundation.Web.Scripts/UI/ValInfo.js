var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Control = (function () {
    function Control() {
    }
    return Control;
}());
var Grid = (function (_super) {
    __extends(Grid, _super);
    function Grid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ChildGroup = new List();
        return _this;
    }
    return Grid;
}(Control));
/*class TestMetaData {
//    @MetaDataA("avc")
//    public Width:number;
//}

//function MetaDataA(str:string) {
//    console.log("MetaDataA(): evaluated"+str);
//    return function (target, propertyKey: string) {
//        console.log("g(): called" + str);
//    }
//}


//var control = new MetaData.TypeInfo("Control");

//var container = new MetaData.TypeInfo("Container");
//var grid = new MetaData.TypeInfo("Grid",container);
//var widthAtr = new MetaData.AtrInfo("Width",
//    MetaData.SimpleType.int,
//    false,
//    new MetaData.ValLimitForDouble(0,3,3));
//grid.AtrGroup.Set(widthAtr);
//grid.ElmGroupMode = MetaData.ElmGroupMode.Loose;
//grid.ElmGroupType = MetaData.ElmGroupType.Many;
//grid.ElmGroup.Set(control);


//<Grid base="Control">
//    <width type="int" required="true"  min="0" max="3" fraction="3" />
//   <_many>
//        <control type="Controller"/>
//         <grid  type="EasyUIGrid"/>
//    </_many>
//</Grid>*/

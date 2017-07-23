abstract class Control {  
    Width: string;
    Height:string;
}

abstract class Grid extends Control {
    @ValLimit(new MetaData.ValLimitForInt(10, 100))
    Cols: number;
    ChildGroup:List<Control>=new List<Control>();
}

class TextBox extends Control {
    Enable:boolean;
}

function ValLimit(valLimitBase:MetaData.ValLimitBase) {
    return function (target, propertyKey: string) {
       
    }
}

/*
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

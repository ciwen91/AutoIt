namespace UI {
   export  abstract class Control {
        Width: string=None;
        Height: string=None;
    }

   export class Grid extends Control {
        @ValLimitAtr(new MetaData.ValLimitForInt(10, 100))
        Cols: number=1;
        ChildGroup: List<Control>=new List<Control>();
    }

    export class TextBox extends Control {
        Enable: boolean=true;
   }

    export  class Other {
        
    }
}

setTimeout(function() {
        var typeInfoGroup = MetaDataHelper.GetAllTypeInfo(UI, UI.Control);

        $.Enumerable.From(typeInfoGroup.ToArray())
            .ForEach(item => {
                console.log(item.Item2);
            });
    },
    0);

//function init() {
//    var classgroup = getAll();
//    var typeInfoGroup = new Dictionary<any,MetaData.TypeInfo>();

//   classgroup.ToEnumerble()
//        .ForEach(item => {
//            fillTypeInfo(item, typeInfoGroup, classgroup);
//        });

//   console.log($.Enumerable.From(typeInfoGroup.ToArray()).Select(item=>item.Item2).ToArray());
//}

//function getAll():List<any> {
//    var group = new List<any>();

//    for (var key in UI) {
//        var item = UI[key];
//        if (IsType(item, UI.Control)) {
//            group.Set(item);
//        }
//    }

//    return group;
//}

//function fillTypeInfo(controlType: any, infoGroup: Dictionary<any,MetaData.TypeInfo>, typeGroup: List<any>): MetaData.TypeInfo {
//    if (infoGroup.Contains(controlType)) {
//        return infoGroup.Get(controlType);
//    }

//    var parent = getParentType(controlType);
//    var parentType = null;
//    if (typeGroup.Contains(parent)) {
//        parentType = fillTypeInfo(parent, infoGroup, typeGroup);
//    }
   
//    var typeInfo = new MetaData.TypeInfo(controlType.name, parentType);
//    infoGroup.Set(controlType,typeInfo);
//    return typeInfo;
//}

//setTimeout(function() {
//        for (var item in UI) {
//            if (IsType(UI[item], UI.Control)) {
//                console.log(GetType(UI[item]).name);
//                new MetaData.TypeInfo("")
//            }
//        }
//    },
//    0);


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

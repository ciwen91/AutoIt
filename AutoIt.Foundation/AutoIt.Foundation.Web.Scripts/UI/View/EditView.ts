abstract class View extends Control {
    
}

class EditView extends View{
    MetaData: List<any>;

    constructor(metaData: List<any>) {
        super();
        this.MetaData = metaData;

        this.Build();
    }

    GetHtmlInner() {
        return "<form></form>";
    }

    Build() {
        var controlGroup = this.MetaData.ToEnumerble()
            .GroupBy(item => item.Group)
            .Select(item => {
                var group = item.Key() || "基本信息";
                var tableLayout = new GridLayout(2);
                tableLayout.ColWidthGroup = ["65"];
                tableLayout.Height = "";

                for (var meta of item.source) {
                    var control = this.MetaToControl(meta);
                    tableLayout.ChildGroup.push(new RawControl(control.Title));
                    tableLayout.ChildGroup.push(control);
                }

                return { Group: group, Control: tableLayout };
            })
            .ToList();

        var child: Control = null;

        if (controlGroup.Count() == 1) {
            child = controlGroup.Get(0).Control;
        }
        else if (controlGroup.Count() > 1) {
            var tabs = new TabsLayout();
            child = tabs;

            controlGroup.ToEnumerble().ForEach(item => {
                tabs.Add(item.Group, item.Control);
            }); 
        }

        if (child != null) {
            this.ChildGroup.push(child);
        }
    }

    MetaToControl(meta: any): Control {
        var control: Control;
      

        if (meta.Type == "string") {
            control = new TextBox();
        }
        else if (meta.Type == "number") {
            control = new NumberBox();

            if (!IsEmpty(meta.Min) && !IsEmpty(meta.Max) && meta.Max - meta.Min <= 100) {
                control = new SliderBox();
            }
        }
        else if (meta.Type == "datetime") {
            control = new DateBox();
        }
        else if (meta.Type == "bool") {
            control = new SwitchBox();
        }
        else if (meta.Type === "enum") {

        }

        control.ID = this.ID + "_" + meta.Name;

        for (var name in meta) {
            control[name] = meta[name];
        }

        console.log(control);

        return control;
    }
    
}


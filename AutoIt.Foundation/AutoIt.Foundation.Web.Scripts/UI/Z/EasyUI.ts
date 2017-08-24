Panel.prototype.GetHtmlInner = () => {
    return '<div class="easyui-panel"/>';
};

DockLayout.prototype.GetHtmlInner = () => {
    return '<div class="easyui-layout" data-options="fit:true"/>';
};
DockLayout.prototype.GetChildHtml = function(control) {
    var html = control.GetHtml();
    var htmlWrapper = new HtmlWraper(html);

    if (this.Top && control == this.Top) {
        AddEasyUIOption(htmlWrapper, 'region', 'north');
    } else if (this.Left && control == this.Left) {
        AddEasyUIOption(htmlWrapper, 'region', 'west');
    } else if (this.Center && control == this.Center) {
        AddEasyUIOption(htmlWrapper, 'region', 'center');
    } else if (this.Right && control == this.Right) {
        AddEasyUIOption(htmlWrapper, 'region', 'east');
    } else if (this.Bottom && control == this.Bottom) {
        AddEasyUIOption(htmlWrapper, 'region', 'south');
    }

    return html;
};

TabsLayout.prototype.SetTag=tagObj => {
    tagObj.EasyUIType = "tabs";
}
TabsLayout.prototype.GetHtmlInner = () => {
    return '<div class="easyui-tabs" data-options="fit:true"></div>"';
}
TabsLayout.prototype.GetChildHtml = control => {
    var html = control.GetHtml();
    var layoutInfo = control.TagObj.TabsLayout;

    html = `<div title="${layoutInfo.Title}" style="padding: 3px">${html}</div>`;
    var wraper = new HtmlWraper(html);

    if (!IsEmpty(layoutInfo.Closable)) {
        AddEasyUIOption(wraper, 'closable', layoutInfo.Closable);
    }
    if (!IsEmpty(layoutInfo.Icon)) {
        AddEasyUIOption(wraper, 'iconCls', layoutInfo.Icon);
    }
    
    return wraper.ToHtml();
}
TabsLayout.prototype.Add = function (title: string, content: Control, closable: boolean = false, icon = "") {
    content.TagObj.TabsLayout = {
        Title: title,
        Closable: closable,
        Icon: icon
    };
    this.ChildGroup.push(content);

    if (this.IsInited) {
        DoEasyUIFun(this, 'add', {
            title: title,
            closable: closable,
            icon: icon,
            content: content.GetHtml()
        });
    }
}
TabsLayout.prototype.Close = function (title: string) {
    DoEasyUIFun(this, 'close', title);
}
TabsLayout.prototype.Exists = function (title: string) {
    return DoEasyUIFun(this, 'exists', title);
}
TabsLayout.prototype.Select = function (title: string) {
    DoEasyUIFun(this, 'select', title);
}
   


/******************************EditBox******************************/
FormControl.prototype.IncludeHtmlAtrInner = function (htmlWrapper) {
    Control.prototype.IncludeHtmlAtrInner.call(this, htmlWrapper);
    AddEasyUIOption(htmlWrapper, "disabled", !this.Enable);
};
FormControl.prototype.SetEnable = function (isEnable) {
    this.IsEnable = isEnable;
    DoEasyUIFun(this, isEnable ? "enable" : "disable");
};

ValidateBox.prototype.SetTag=tagObj => {
    tagObj.EasyUIType = "validatebox";
}
ValidateBox.prototype.GetHtmlInner = function () {
    return `<input class="easyui-${this.TagObj.EasyUIType}"/>`;
};
ValidateBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    FormControl.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);

    AddEasyUIOption(htmlWraper, "required", this.Required);
    AddEasyUIOption(htmlWraper, "editable", this.Editable);
    AddEasyUIOption(htmlWraper, "missingMessage", this.Prompt);
};
ValidateBox.prototype.InitInner = function ()  {
    var self = this;

    DoEasyUIFun(self,
        None,
        {
            onChange: newVal => {
                self.OnChange.Do(self, newVal);
            }
        });
};
ValidateBox.prototype.Valid = function() {
    DoEasyUIFun(this, "validate");
};
ValidateBox.prototype.IsValid = function () {
    return DoEasyUIFun(this, "isValid");
}
ValidateBox.prototype.SetEditable = function (isEditable) {
    this.Editable = isEditable;
    DoEasyUIFun(this, "readonly", isEditable);
};
ValidateBox.prototype.GetValue=function() {
    return DoEasyUIFun(this, 'getValue');
{}}
ValidateBox.prototype.SetValue = function(val: any) {
    DoEasyUIFun(this, 'setValue', val);
};

TextBox.prototype.SetTag = tagObj => {
    tagObj.EasyUIType = 'textbox';
};
TextBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);

    AddEasyUIOption(htmlWraper, "type", this.Type == TextBoxType.Password ? 'password' : 'text');
    AddEasyUIOption(htmlWraper, "multiline", this.Multiline);
};

NumberBox.prototype.SetTag=tagObj => {
    tagObj.EasyUIType = "numberbox";
}
NumberBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this,htmlWraper);

    AddEasyUIOption(htmlWraper, "min", this.Min);
    AddEasyUIOption(htmlWraper, "max", this.Max);
    AddEasyUIOption(htmlWraper, "precision", this.Precision);
};

SliderBox.prototype.SetTag=tagObj => {
    tagObj.EasyUIType = "slider";
}
SliderBox.prototype.IncludeHtmlAtrInner = function (htmlWraper) {
    NumberBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);

    AddEasyUIOption(htmlWraper, "showTip", true); 
    AddEasyUIOption(htmlWraper, "range", this.IsRange); 
};

DateBox.prototype.SetTag = function (tagObj) {
    var type = ''; 

    if (this.Mode == DateMode.Date) {
        type = 'datebox';
    }
    else if (this.Mode == DateMode.Time) {
        type = 'timespinner';
    }
    else if (this.Mode == DateMode.DateTime) {
        type = 'datetimebox';
    }

    tagObj.EasyUIType = type;
};

SwitchBox.prototype.SetTag=tagObj => {
    tagObj.EasyUIType = 'switchbutton';
};
SwitchBox.prototype.GetValue = function() {
    return DoEasyUIFun(this, 'options').checked;
};
SwitchBox.prototype.SetValue = function(val) {
    DoEasyUIFun(this, val ? "check" : "uncheck");
};

SelectBox.prototype.SetTag = function (tagObj) {
    tagObj.EasyUIType = this.Multiple ? "tagbox" : "combobox";
};
SelectBox.prototype.IncludeHtmlAtrInner=function(htmlWraper) {
    ValidateBox.prototype.IncludeHtmlAtrInner.call(this, htmlWraper);

    AddEasyUIOption(htmlWraper, "hasDownArrow", true);
    AddEasyUIOption(htmlWraper, "valueField", this.ValueField);
    AddEasyUIOption(htmlWraper, "textField", this.TextField);
    AddEasyUIOption(htmlWraper, "multiple", this.Multiple);
}
SelectBox.prototype.InitInner= function() {
    var self = this;

    DoEasyUIFun(self,
        None,
        {
            onChange: newVal => {
                self.OnChange.Do(self, newVal);
            },
            onSelect:item => {
                self.OnSelect.Do(self, item);
            }
        }); 
}
SelectBox.prototype.GetData=function() {
    return DoEasyUIFun(this, "getData");
}
SelectBox.prototype.SetData=function(data) {
    DoEasyUIFun(this, "loadData",data);
}
/******************************CommonFunc******************************/
function AddEasyUIOption(htmlWrapper: HtmlWraper, name: string, val: any) {
    if (!IsEmpty(val)) {
        //转换成Jquery对象
        var keyValue = `${name}:${ToValueStr(val, "'")}`;

        //设置EasyUI属性
        var option = htmlWrapper.GetAtr('data-options');
        option = option ? option + "," + keyValue : keyValue;
        htmlWrapper.SetAtr('data-options', option);
    }
}

function DoEasyUIFun(control:Control,funName:string,...args:any[]):any {
    var elm = $('#' + control.ID);
    var easyUIElm = <any>elm[control.TagObj.EasyUIType];

    if (!HasEasyUIFunc(control,funName)) {
        //对于不可编辑的元素,改变Enable状态
        if (funName == "readonly") {
            funName = args[0] ? "disable" : "enable";
        }
    }

    if (IsEmpty(funName)) {
        return easyUIElm.apply(elm, args);
    } else if (HasEasyUIFunc(control, funName)) {
        var callArgs = [funName].concat(args);
        return easyUIElm.apply(elm, callArgs);
    } else {
        return None;
    }
}

function HasEasyUIFunc(control: Control, funName: string): boolean {
    var classGroup = $('#' + control.ID).attr('class').split(' ');
    var typeGroup = $.Enumerable.From(classGroup)
        .Where(item => item.indexOf('-f') >= 0)
        .Select(item => item.substr(0, item.indexOf('-f')))
        .ToArray();

    var exsit = $.Enumerable.From(typeGroup)
        .Any(item => $.fn[item].methods[funName]);

    return exsit;
}



Panel.prototype.GetHtmlInner = () => {
    return '<div class="easyui-panel"/>';
};
DockLayout.prototype.GetHtmlInner = () => {
    return '<div class="easyui-layout" data-options="fit:true"/>';
};
DockLayout.prototype.GetChildHtml = control => {
    var html = control.GetHtml();

    if (this.Top && control == this.Top) {
        html = AddEasyUIOption(html, 'region', 'north');
    } else if (this.Left && control == this.Left) {
        html = AddEasyUIOption(html, 'region', 'west');
    } else if (this.Center && control == this.Center) {
        html = AddEasyUIOption(html, 'region', 'center');
    } else if (this.Right && control == this.Right) {
        html = AddEasyUIOption(html, 'region', 'east');
    } else if (this.Bottom && control == this.Bottom) {
        html = AddEasyUIOption(html, 'region', 'south');
    }

    return html;
};

function AddEasyUIOption(html:string,name:string,val:any):string {
    if (val != None) {
        //转换成Jquery对象
        var html$ = $(html);
        var keyValue = `${name}:${ToValueStr(val, "'")}`;

        //设置EasyUI属性
        var option = html$.attr('data-options');
        option = option ? option + "," + keyValue : keyValue;
        this._Html$.attr('data-options', option);

        //转换成Html
        html = html$.ToHtml();
    }

    return html;
}
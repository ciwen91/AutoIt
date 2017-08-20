class HtmlWraper {
    static Empty = new HtmlWraper("");

    private _Html$: JQuery;

    constructor(html: string) {
        this._Html$ = $(html);
    }

    GetAtr(atrName: string): string {
        return this._Html$.attr(atrName);
    }
    SetAtr(attrName: string, attrVal: any): HtmlWraper {
        if (attrVal != None) {
            this._Html$.attr(attrName, attrVal.toString());
        }

        return this;
    }
    SetStyle(cssName: string, cssVal: any): HtmlWraper {
        if (cssVal != None) {
            this._Html$.css(cssName, cssVal.toString());
        }

        return this;
    }
    ReplaceStyle(style: string):HtmlWraper {
        if (style != None) {
            this._Html$.attr("style", style);
        }

        return this;
    }
    AddClass(clsName: any): HtmlWraper {
        if (clsName != None) {
            this._Html$.addClass(clsName.toString());
        }

        return this;
    }
    //AddEasyUIOption(optionName: string, optionVal: any) {
    //    if (optionVal != None) {
    //        var keyValue = `${optionName}:${ToValueStr(optionVal, "'")}`;
    //        var option = this._Html$.attr('data-options');
    //        option = option ? option + "," + keyValue : keyValue;
    //        this._Html$.attr('data-options', option);
    //    }

    //    return this;
    //}
    AppendHtml(html: string): HtmlWraper {
        if (!IsEmpty(html)) {
            this._Html$.append(html);
        }

        return this;
    }
    ToHtml(): string {
        return this._Html$.ToHtml();
    }
}
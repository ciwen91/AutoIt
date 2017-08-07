abstract class Control extends ObjBase {
    //@ValLimitAtr(new MetaData.ValLimitForStr())
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    ID: string = NewGuidStr(16);
    @HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
    Width: string = "";
    @HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
    Height: string = "";
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    Title: string = "";
    ClassName: string = "";
    Style: string = ""; 

    Parent: Control=null;
    ChildGroup: Control[] = [];

    //OnGetChildHtml: Interceptor<Control, string> = new Interceptor<Control, string>();

 
    GetHtml(): string {
        //获取Html
        var html = this.GetHtmlInner();
        var htmlWrapper = new HtmlWraper(html);

        //添加属性
        this.IncludeHtmlAtr(htmlWrapper);

        //添加子元素Html
        for (var item of this.ChildGroup) {
            var sonHtml = this.GetChildHtml(item);
            htmlWrapper.AppendHtml(sonHtml);
        }

        return htmlWrapper.ToHtml();
    };
    GetChildHtml(control:Control) {
        return control.GetHtml();
    }
    Init() {
        this.InitInner();

        for (var item of this.ChildGroup) {
            item.Init();
        }
    }


    GetHtmlInner(): string {
        return null;
    }
    InitInner() {
        
    }

    private IncludeHtmlAtr(htmlWrapper: HtmlWraper): HtmlWraper {
        var type = GetType(this);
        
        htmlWrapper.AddClass(this.ClassName||None);
        htmlWrapper.SetStyle(this.Style || None);

        for (var propName of MetaDataHelper.GetAllPropName(type).ToArray()) {
            var htmlAtrInfo = <MetaData.HtmlAtrInfo>MetaDataHelper.GetAtr(type, MetaData.HtmlAtrInfo, propName);

            if (htmlAtrInfo == null) {
                continue;
            }

            if (htmlAtrInfo.Type == MetaData.HtmlAtrType.HtmlAtr) {
                htmlWrapper.AddAtr(propName.toLowerCase(), this.GetMemberValue(propName));
            } else if (htmlAtrInfo.Type == MetaData.HtmlAtrType.StyleAtr) {
                htmlWrapper.AddStyle(propName.toLowerCase(), this.GetMemberValue(propName));
            }
        }

        return htmlWrapper;
    }
}


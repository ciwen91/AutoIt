abstract class Control extends ObjBase {
    //@ValLimitAtr(new MetaData.ValLimitForStr())
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    ID: string = NewGuidStr(6);
    @HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
    Width: string = "100%";
    @HtmlAtr(MetaData.HtmlAtrType.StyleAtr)
    Height: string = "100%";
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    Title: string = "";
    ClassName: string = "";
    Style: string = ""; 

    TagObj:any={};
    Parent: Control=null;
    ChildGroup: Control[] = [];

    IsInited: boolean = false;

    constructor() {
        super();
    }

    GetHtml(): string {
        this.SetTag(this.TagObj);

        //获取Html
        var html = this.GetHtmlInner();
        var htmlWrapper = new HtmlWraper(html);

        //添加属性
        this.IncludeHtmlAtr(htmlWrapper);

        //添加子元素Html
        var sonHtml = "";
        for (var item of this.ChildGroup) {
            sonHtml += this.GetChildHtml(item);
        }
        if (sonHtml) {
            htmlWrapper.AppendHtml(sonHtml);
        }

        return htmlWrapper.ToHtml();
    }
    GetChildHtml(control:Control) {
        return control.GetHtml();
    }
    Init() {
        this.InitInner();

        for (var item of this.ChildGroup) {
            item.Init();
        }

        this.IsInited = true;
    }

    SetTag(tagObj: any) {

    }
    GetHtmlInner(): string {
        return None;
    }
    IncludeHtmlAtrInner(htmlWraper:HtmlWraper) {
        
    }
    InitInner() {
        
    }

    private IncludeHtmlAtr(htmlWrapper: HtmlWraper): HtmlWraper {
        var type = GetType(this);

        htmlWrapper.AddClass(this.ClassName || None);
        htmlWrapper.ReplaceStyle(this.Style || None);
        
        for (var propName of MetaDataHelper.GetAllPropName(type).ToArray()) {
            var htmlAtrInfo = <MetaData.HtmlAtrInfo>MetaDataHelper.GetAtr(type, MetaData.HtmlAtrInfo, propName);

            if (htmlAtrInfo == null) {
                continue;
            }

            if (htmlAtrInfo.Type == MetaData.HtmlAtrType.HtmlAtr) {
                htmlWrapper.SetAtr(propName.toLowerCase(), this.GetMemberValue(propName));
            } else if (htmlAtrInfo.Type == MetaData.HtmlAtrType.StyleAtr) {
                htmlWrapper.SetStyle(propName.toLowerCase(), this.GetMemberValue(propName));
            }
        }

        this.IncludeHtmlAtrInner(htmlWrapper);

        return htmlWrapper;
    }
}
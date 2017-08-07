class GridLayout extends Control {
    static RowSpan: AttachProperty<number> = new AttachProperty<number>();
    static ColSpan: AttachProperty<number> = new AttachProperty<number>();

    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    CellPadding: string = "0px";
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    CellMargin: string = "0px";
    @HtmlAtr(MetaData.HtmlAtrType.HtmlAtr)
    Border: string = "0px";
  
    ColCount: number = 1;
    ColWidthGroup = [];
    RowHeightGroup = [];

    private _Table: Table<Control>;

    constructor(colCount: number) {
        super();

        this.ColCount = colCount; 
    }

    GetHtmlInner(): string {
        return '<table style="table-layout:fixed;"><tbody/></table>';
    }

    GetChildHtml(control: Control): string {
        //获取参数
        var html = control.GetHtml();
        var index = this.ChildGroup.indexOf(control);

        //重新初始化Table
        var isFirst = index == 0;
        if (isFirst) {
            this._Table = new Table<Control>(this.ColCount);
        }

        //填充Table结构,获得位置
        var curPoint = this._Table.Pos;
        var size = new Size(control.GetExtData(GridLayout.ColSpan, 1), control.GetExtData(GridLayout.RowSpan, 1));
        this._Table.Add(size, control);
        var nextPoint = this._Table.Pos;

        //包括td
        html = `<td rowspan='${size.Height}' colspan='${size.Width}'>${html}</td>`;
     
        //如果换了行
        if (isFirst || nextPoint.Y > curPoint.Y) {
            var heightStr = this.RowHeightGroup[nextPoint.Y] ? "height=" + this.RowHeightGroup[nextPoint.Y] : "";
            html = `</tr><tr ${heightStr}>` + html;
        }

        //如果是首行
        if (isFirst) {
            //首行限制宽度
            var headHtml = "<tr style='height:0px;'>";
            headHtml += $.Enumerable.From(ArrayHelper.FromInt(0, this.ColCount - 1))
                .Select(i => `<td ${this.ColWidthGroup[i] ? "width='" + this.ColWidthGroup[i] + "'" : ""}></td>`)
                .ToArray()
                .join("");

            html = headHtml + html;
        }

        //如果是末行
        var isLast = index == this.ChildGroup.length - 1;
        if (isLast) {
            html = html + '</tr>';
        }

        return html;
    }
}
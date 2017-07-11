namespace CodeEdit.LangAnaly.Model {
    //语法分析信息
    export class GramerAnalyInfo {
        //语法信息
        GramerInfo: GramerInfo;
        ParantMaySymbolGroup:List<Model.Symbol>;

        constructor(gramerInfo: GramerInfo) {
            this.GramerInfo = gramerInfo;
            this.ParantMaySymbolGroup = gramerInfo.GetParentMaySymbolGroup();
        }
    }
}
namespace CodeEdit.LangAnaly.Model {
    //语法分析信息
    export class GramerAnalyInfo {
        //语法信息
        GramerInfo: GramerInfo;
        //可能的符号集合
        ParantMaySymbolGroup: List<Symbol>;

        constructor(gramerInfo: GramerInfo, parantMaySymbolGroup: List<Symbol>) {
            this.GramerInfo = gramerInfo;
            this.ParantMaySymbolGroup = parantMaySymbolGroup;
        }
    }
}
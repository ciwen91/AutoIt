namespace CodeEdit.LangAnaly.Model {
    export class GramerAnalyInfo {
        GramerInfo: GramerInfo;
        ParantMaySymbolGroup: List<Symbol>;

        constructor(gramerInfo: GramerInfo, parantMaySymbolGroup: List<Symbol>) {
            this.GramerInfo = gramerInfo;
            this.ParantMaySymbolGroup = parantMaySymbolGroup;
        }
    }
}
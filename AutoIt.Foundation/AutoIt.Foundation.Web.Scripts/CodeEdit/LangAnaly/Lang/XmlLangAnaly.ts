namespace CodeEdit.LangAnaly {
    export class XmlLangAnaly extends LangAnalyBase {
        IsGramerMeanEro(gramerInfo: Model.GramerInfo): boolean {
            //标签名称
            var symbolName = gramerInfo.Symbol.Name;

            if (symbolName == "End Tag") {
                //起始标签
                var startGramer = this._GramerReader
                    .GetClosetGrammer(item => item.Symbol != null && item.Symbol.Name == "Start Tag");
                var startTagName = this.GetTagName(startGramer.Value);

                //结束标签与起始标签名称不一致,则语法无意义
                var endTagName = this.GetTagName(gramerInfo.Value);
                if (endTagName != startTagName) {
                    return false;
                }
            }

            return super.IsGramerMeanEro(gramerInfo);
        }

        //获取标签名称(文本)
        private GetTagName(text: string): string {
            var group = /\w+/g.exec(text);
            var tagName = group ? group[0] : "";
            return tagName;
        }
    }
}
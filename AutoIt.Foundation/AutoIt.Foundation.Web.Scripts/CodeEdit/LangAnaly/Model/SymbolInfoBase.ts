module CodeEdit.LangAnaly.Model {
    //符号信息基类
    export class SymbolInfoBase {
        //符号
        public Symbol: CodeEdit.LangAnaly.Model.Symbol;
        //对应字符串
        public Value: string;
        //行
        public Line: number;
        //列
        public Col: number;
        //索引
        public Index: number;
        //数据
        public Data: Object;

        constructor(symbol: CodeEdit.LangAnaly.Model.Symbol,value:string,line:number,col:number,index:number) {
            this.Symbol = symbol;
            this.Value = value;
            this.Line = line;
            this.Col = col;
            this.Index = index;
        }

        Contains(line: number, col: number): boolean {
            var startPoint = this.StartLintPoint();
            var endPoint = this.EndLinePoint();
            var curPoint = new LinePoint(-1, col, line);

            return curPoint.Compare(startPoint) >= 0 && curPoint.Compare(endPoint) <= 0;
        }

        //开始位置
        StartLintPoint(): LinePoint {
            return new LinePoint(this.Index, this.Col, this.Line);
        }

        //结束位置
        EndLinePoint(): LinePoint {
            var point = this.Value.NextPoint(LinePoint.Empty, this.Value.length - 1);
            var endPoint = this.StartLintPoint().Add(point);
            return endPoint;
        }
    }
}
module CodeEdit.LangAnaly.Model {
    export  class SymbolInfoBase {
        public Symbol: CodeEdit.LangAnaly.Model.Symbol;
        public Value: string;
        public Line: number;
        public Col: number;
        public Index: number;
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

        StartLintPoint(): LinePoint {
            return new LinePoint(this.Index, this.Col, this.Line);
        }

        EndLinePoint(): LinePoint {
            return this.Value.NextPoint(this.Value.length-1, this.StartLintPoint());
        }
    }
}
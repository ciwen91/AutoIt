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
    }
}
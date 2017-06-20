module CodeEdit.LangAnaly.Model {
    //������Ϣ����
    export class SymbolInfoBase {
        //����
        public Symbol: CodeEdit.LangAnaly.Model.Symbol;
        //��Ӧ�ַ���
        public Value: string;
        //��
        public Line: number;
        //��
        public Col: number;
        //����
        public Index: number;
        //����
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

        //��ʼλ��
        StartLintPoint(): LinePoint {
            return new LinePoint(this.Index, this.Col, this.Line);
        }

        //����λ��
        EndLinePoint(): LinePoint {
            var point = this.Value.NextPoint(LinePoint.Empty, this.Value.length - 1);
            var endPoint = this.StartLintPoint().Add(point);
            return endPoint;
        }
    }
}
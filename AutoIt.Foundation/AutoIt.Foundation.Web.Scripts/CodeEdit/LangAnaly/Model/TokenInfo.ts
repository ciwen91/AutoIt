module CodeEdit.LangAnaly.Model {
    export class TokenInfo extends CodeEdit.LangAnaly.Model.SymbolInfoBase {
        State: CodeEdit.LangAnaly.Model.TokenInfoState;

        constructor(state: CodeEdit.LangAnaly.Model.TokenInfoState,
            symbol: CodeEdit.LangAnaly.Model.Symbol,
            value: string,
            index: number,
            line: number,
            col: number) {
            super(symbol, value, line, col, index);
            this.State = state;
        }
    }
}
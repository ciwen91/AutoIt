module CodeEdit.LangAnaly.Model {
    //�Ǻ�
    export class TokenInfo extends CodeEdit.LangAnaly.Model.SymbolInfoBase {
        //״̬
        State: CodeEdit.LangAnaly.Model.TokenInfoState;

        static NullToken():TokenInfo {
            return new Model.TokenInfo(Model.TokenInfoState.Accept,
                null,
                null,
                -1,
                -1,
                -1);
        }

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
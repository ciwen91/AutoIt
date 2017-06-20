module CodeEdit.LangAnaly.Model {
    //符号类型
    export enum SymbolType {
        //非终结符
        Nonterminal = 0,
        //终结符
        Terminal = 1,
        //可忽略的符号
        Noise = 2,
        //文本末尾
        EndofFile = 3,
        //分组开始
        GroupStart = 4,
        //分组末尾
        GroundEnd = 5,
        //错误
        Error = 7
    }
}
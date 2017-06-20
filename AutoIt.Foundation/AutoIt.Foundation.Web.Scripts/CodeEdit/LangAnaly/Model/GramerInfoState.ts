module CodeEdit.LangAnaly.Model {
    //语法状态
    export enum GramerInfoState {
        //移入
        Shift = 0,
        //规约
        Reduce,
        //接受
        Accept,
        //错误
        Error,
        //(错误)自动补全
        AutoComplete
    }
}
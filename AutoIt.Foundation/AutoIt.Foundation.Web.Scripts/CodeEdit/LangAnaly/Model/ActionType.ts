module CodeEdit.LangAnaly.Model {
  //LALR��������
  export enum ActionType {
        Shift = 1,
        Reduce = 2,
        Goto = 3,
        Accept = 4
    }
}
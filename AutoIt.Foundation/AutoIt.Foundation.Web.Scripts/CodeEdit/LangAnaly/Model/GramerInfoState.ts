module CodeEdit.LangAnaly.Model {
    //�﷨״̬
    export enum GramerInfoState {
        //����
        Shift = 0,
        //��Լ
        Reduce,
        //����
        Accept,
        //����
        Error,
        //(����)�Զ���ȫ
        AutoComplete
    }
}
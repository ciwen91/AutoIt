module CodeEdit.LangAnaly.Model {
    //��������
    export enum SymbolType {
        //���ս��
        Nonterminal = 0,
        //�ս��
        Terminal = 1,
        //�ɺ��Եķ���
        Noise = 2,
        //�ı�ĩβ
        EndofFile = 3,
        //���鿪ʼ
        GroupStart = 4,
        //����ĩβ
        GroundEnd = 5,
        //����
        Error = 7
    }
}
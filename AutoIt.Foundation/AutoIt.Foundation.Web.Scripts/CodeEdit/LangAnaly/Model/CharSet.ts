///<reference path="EgtEntityBase.ts"/>>
namespace CodeEdit.LangAnaly.Model {
   //�ַ���(DFA��)
   export  class  CharSet extends  CodeEdit.LangAnaly.Model.EgtEntityBase{
       //�ַ�����
       public Group: List<CodeEdit.LangAnaly.Model.CharSetItem> = new List<CodeEdit.LangAnaly.Model.CharSetItem>(); 
    }
}
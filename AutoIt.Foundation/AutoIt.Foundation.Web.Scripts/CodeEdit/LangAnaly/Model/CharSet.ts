///<reference path="EgtEntityBase.ts"/>>
namespace CodeEdit.LangAnaly.Model {
   //×Ö·û¼¯(DFA±ß)
   export  class  CharSet extends  CodeEdit.LangAnaly.Model.EgtEntityBase{
       //×Ö·û¼¯Ïî
       public Group: List<CodeEdit.LangAnaly.Model.CharSetItem> = new List<CodeEdit.LangAnaly.Model.CharSetItem>(); 
    }
}
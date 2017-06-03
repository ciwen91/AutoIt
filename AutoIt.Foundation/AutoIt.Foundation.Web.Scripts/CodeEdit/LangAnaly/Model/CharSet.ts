///<reference path="EgtEntityBase.ts"/>>
namespace CodeEdit.LangAnaly.Model {
   export  class  CharSet extends  CodeEdit.LangAnaly.Model.EgtEntityBase{
        public Group: List<CodeEdit.LangAnaly.Model.CharSetItem> = new List<CodeEdit.LangAnaly.Model.CharSetItem>(); 
    }
}
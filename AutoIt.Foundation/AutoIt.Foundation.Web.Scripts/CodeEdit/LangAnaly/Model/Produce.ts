module CodeEdit.LangAnaly.Model {
    //产生式
    export class  Produce extends CodeEdit.LangAnaly.Model.EgtEntityBase {
        //产生式头
        NonTerminal: CodeEdit.LangAnaly.Model.Symbol;
        //产生式主体
        SymbolGroup: List<CodeEdit.LangAnaly.Model.Symbol>;

       static Compare(a: Symbol, b: Symbol, group: List<Produce>): number {
           var isBig = group.ToEnumerble().Any(item => item.NonTerminal == a && item.SymbolGroup.Contains(b));
           var isSmall = group.ToEnumerble().Any(item => item.NonTerminal == b && item.SymbolGroup.Contains(a));

           var result = 0;
           if (isBig) {
               result += 1;
           }
           if (isSmall) {
               result -= 1;
           } 

           if (result == 0) {
              var first=  group.ToEnumerble()
                   .Select(item=>item.NonTerminal)
                   .FirstOrDefault(null, item => item == a || item == b);

               if (first == a) {
                   result = 1;
              }
               else if (first == b) {
                   result = -1;
               }
           }

           return result;
       } 
    }
}
using System.Collections.Generic;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public abstract class LangManagerBase
   {
       private EgtManager _EgtManager;
       protected GramerInfo _ResultGramerInfo;

        public List<string> ContentNameGroup = new List<string>();

        public LangManagerBase(string egtPath)
        {
            this._EgtManager = EgtManager.CreateFromFile(egtPath);
        }

        public object GetValue(string val)
        {
            Analy(val);
            return _ResultGramerInfo?.Data;
        }

        public void Analy(string val)
       {
            _ResultGramerInfo = null;

           var tokenReader = new TokenReader(_EgtManager, val);
           var gramerReader = new GramerReader(_EgtManager);

           while (true)
           {
               var token = tokenReader.ReadToken();
               TokenRead(token);

               if (token.Symbol == null || token.Symbol.Type != SymbolType.Noise)
               {
                   while (true)
                   {
                       var gramer = gramerReader.ReadGramer(token);

                       if (gramer.GramerState == GramerInfoState.Reduce)
                       {
                           var gramerVal = val.Substring(gramer.Index, token.Index - gramer.Index);

                           if (ContentNameGroup.Contains(gramer.Symbol.Name))
                           {
                               var preWhiteSpace = val.MatchPre(@"\s+", gramer.Index - 1);

                               if (preWhiteSpace != null)
                               {
                                   gramerVal = preWhiteSpace + gramerVal;
                                   var newPoint = val.PrePoint(preWhiteSpace.Length,
                                       new LinePoint(gramer.Index, gramer.Col, gramer.Line));
                                   gramer.Index = newPoint.Index;
                                   gramer.Line = newPoint.Y;
                                   gramer.Col = newPoint.X;
                               }
                               gramer.Value = gramerVal;
                               //index,line,col
                           }
                           else
                           {
                               gramerVal = gramerVal.Trim();
                               gramer.Value = gramerVal;
                           }

                           GramerRead(gramer);
                       }
                       else if (gramer.GramerState == GramerInfoState.Accept)
                       {
                           _ResultGramerInfo = gramer.ChildGroup[0];
                           GramerAccept(gramer);
                       }

                       if (gramer.GramerState != GramerInfoState.Reduce)
                       {
                           break;
                       }
                   }
               }

               if (token.State == TokenInfoState.End)
               {
                   break;
               }
           }
       }
        
       public virtual void TokenRead(TokenInfo tokenInfo)
       {
              
       }

       public virtual void GramerRead(GramerInfo gramerInfo)
       {
           
       }

       public virtual void GramerAccept(GramerInfo gramerInfo)
       {

       }
   }
}

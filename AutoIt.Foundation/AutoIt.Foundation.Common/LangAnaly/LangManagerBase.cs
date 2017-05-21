using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.LangAnaly.Model;
using Newtonsoft.Json;

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

                       if (gramer.GramerState == GramerState.Reduce)
                       {
                           var gramerVal = val.Substring(gramer.Index, token.Index - gramer.Index);
                          
                           if (ContentNameGroup.Contains(gramer.Symbol.Name))
                           {
                             
                               var index = gramer.Index - 1;
                                while (index>=0&&(val[index]==' '||val[index]=='\r'||val[index]=='\n'))
                               {
                                   index--;
                               }
                               index = index + 1;
                                                         
                               gramerVal =val.Substring(index,gramer.Index-index) + gramerVal;//index,line,col
                           }
                           else
                           {
                               gramerVal = gramerVal.Trim();
                           }

                           gramer.Value = gramerVal;

                           GramerRead(gramer);
                       }
                       else if (gramer.GramerState == GramerState.Accept)
                       {
                           _ResultGramerInfo = gramer;
                           GramerAccept(gramer);
                       }

                       if (gramer.GramerState != GramerState.Reduce)
                       {
                           break;
                       }
                   }
               }

               if (token.State == TokenState.End)
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

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.LangAnaly.Model;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
   public abstract class LangManagerBase
   {
       private EgtManager _EgtManager;

        public LangManagerBase(string egtPath)
        {
            this._EgtManager = EgtManager.CreateFromFile(egtPath);
        }

       public void Analy(string val)
       {
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
                           GramerRead(gramer);
                       }
                       else if (gramer.GramerState == GramerState.Accept)
                       {
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

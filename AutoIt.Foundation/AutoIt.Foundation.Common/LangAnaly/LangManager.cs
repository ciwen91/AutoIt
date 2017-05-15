using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.LangAnaly.Model;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
   public class LangManager
   {
       private EgtManager _EgtManager;

        public LangManager(string egtPath)
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

    public class MyLangManager:LangManager
    {
        public MyLangManager(string egtPath) : base(egtPath)
        {
        }

        public override void TokenRead(TokenInfo tokenInfo)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(tokenInfo.Symbol.Name+","+tokenInfo.Value);
        }

        public override void GramerRead(GramerInfo gramerInfo)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(gramerInfo.Symbol.Name + "," + gramerInfo.Value);
        }

        public override void GramerAccept(GramerInfo gramerInfo)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(gramerInfo.Symbol.Name + "," + gramerInfo.Value);
        }
    }
}

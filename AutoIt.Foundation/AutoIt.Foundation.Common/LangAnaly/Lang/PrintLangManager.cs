using System;
using AutoIt.Foundation.Common.LangAnaly.Model;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class PrintLangManager: LangManagerBase
    {
        public PrintLangManager(string egtPath) : base(egtPath)
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
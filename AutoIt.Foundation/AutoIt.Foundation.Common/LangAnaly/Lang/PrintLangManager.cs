using System;
using System.Diagnostics;
using AutoIt.Foundation.Common.LangAnaly.Model;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class PrintLangManager: LangManagerBase
    {
        public  bool PrintToken { get; set; }

        public PrintLangManager(string egtPath) : base(egtPath)
        {
        }

        public override void TokenRead(TokenInfo tokenInfo)
        {
            if (PrintToken)
            {
                var color = Console.ForegroundColor;

                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine(tokenInfo.Value + "," + tokenInfo.Symbol.Name);
                Console.ForegroundColor = color;
            } 
        }

        public override void GramerRead(GramerInfo gramerInfo)
        {
            var color = Console.ForegroundColor;

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(new string(' ', gramerInfo.Level*3) + gramerInfo.Level + ":" + gramerInfo.Symbol.Name +
                              "," + gramerInfo.Value + "$");
            Console.ForegroundColor = color;
        }

        public override void GramerAccept(GramerInfo gramerInfo)
        {
            var color = Console.ForegroundColor;

            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine(gramerInfo.Symbol.Name + "," + gramerInfo.Value);
            Console.ForegroundColor = color;
        }
    }
}
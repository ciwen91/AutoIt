using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.LangAnaly;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace AutoIt.Foundation.Test
{
    class Program
    {
        static void Main(string[] args)
        {
            JsonConvert.DefaultSettings = () =>
            {
                var setting= new JsonSerializerSettings();
                setting.Converters.Add(new StringEnumConverter());
                //setting.Formatting= Formatting.Indented;
                return setting;
            };
            
            var manager = new MyLangManager(@"D:\应用软件\GoldParser\Calculate.egt");

            manager.Analy(@"
1.23+   3*1");
        }
    }
}

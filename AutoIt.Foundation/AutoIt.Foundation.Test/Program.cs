using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.LangAnaly;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Xml.Linq;
using AutoIt.Foundation.Common.ClassHelper;

namespace AutoIt.Foundation.Test
{
    class Program
    {
        static void Main(string[] args)
        {
//            JsonConvert.DefaultSettings = () =>
//            {
//                var setting = new JsonSerializerSettings();
//                setting.Converters.Add(new StringEnumConverter());
//                //setting.Formatting= Formatting.Indented;
//                return setting;
//            };


//            var manager1 = new PrintLangManager(@"Data\xml.egt")
//            {
//                ContentNameGroup = new List<string>() {"Word", "Text", "Content"}
//            };
//            manager1.Analy(@"
//<root a=""1"" b=""2"">
//  <page width=""400px"" height=""500px""> 
//   jj, kll, </page>
//</root>");

            //            var manager = new CalculateLangManager(@"D:\应用软件\GoldParser\Calculate.egt");
            //           var result= manager.GetValue(@"
            //(1.23+   3)*1.5-2/0.3+(1.2-2)*1.3 ");
            //            Console.WriteLine(result);


            //var element = XElement.Parse(File.ReadAllText("Data/xml.xml"));
            //Console.WriteLine(element.Value);

            ToBase64File(@"D:\项目\AutoIt\AutoIt.Foundation\AutoIt.Foundation.Web.Scripts\Data\Xml.egt");
        }

        static void ToBase64File(string path)
        {
           var byteGroup= File.ReadAllBytes(path);
           var base64Str= Convert.ToBase64String(byteGroup);

            string targetPath = Path.Combine(Path.GetDirectoryName(path), Path.GetFileName(path) + ".base64");
            File.WriteAllText(targetPath,base64Str);
        }
    }
}

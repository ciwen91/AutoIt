using System;
using AutoIt.Foundation.Common;
using AutoIt.Foundation.Common.Test.Core;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class DepencyDataTest:TestBase
    {
        private static DependcyData<int> _DepencyData1 = new DependcyData<int>();
        private static DependcyData<int> _DepencyData2 = new DependcyData<int>();

        public DepencyDataTest(ITestOutputHelper output) : base(output)
        {
        }

        static DepencyDataTest()
        {
            _DepencyData1.Default = 10;
            _DepencyData2.Default = 100;

            _DepencyData1.GetDataFunc = (object tag,string region,out bool hasValue)=>
            {
                hasValue = true;

                if (tag != null && tag.ToString() == "张三")
                {
                    if (region != null && region == "中国")
                    {
                        return _DepencyData1.Default*3;
                    }
                    else
                    {
                        return _DepencyData1.Default*2;
                    }
                }

                hasValue = false;

                return default(int);
            };

        }

        [Fact]
        public void Test()
        {
           WriteLine(_DepencyData1.GetData());
           WriteLine(_DepencyData1.GetData("张三"));
           WriteLine(_DepencyData1.GetData("张三","中国"));

           WriteLine("-------------------------");

            WriteLine(_DepencyData2.GetData());
            WriteLine(_DepencyData2.GetData("张三"));
            WriteLine(_DepencyData2.GetData("张三", "中国"));

            using (var context = new Context())
            {
                context.Set<T>("", value);

            }
        }
    }
}

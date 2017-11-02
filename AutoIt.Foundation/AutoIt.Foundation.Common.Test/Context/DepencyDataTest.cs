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
            _DepencyData1.Default = 1;
            _DepencyData2.Default = 2;

            _DepencyData1.GetDataFunc = (object tag,string region,out bool hasValue)=>
            {
                hasValue = true;

                if (tag != null && tag.ToString() == "张三")
                {
                    if (region != null && region == "中国")
                    {
                        return 100;
                    }
                    else
                    {
                        return 10;
                    }
                }

                hasValue = false;

                return default(int);
            };

        }

        [Fact]
        public void Test()
        {
            Assert.Equal(1,_DepencyData1.GetData());
            Assert.Equal(10, _DepencyData1.GetData("张三"));
            Assert.Equal(100, _DepencyData1.GetData("张三", "中国"));

            Assert.Equal(2,_DepencyData2.GetData());
            Assert.Equal(2, _DepencyData2.GetData("张三"));
            Assert.Equal(2, _DepencyData2.GetData("张三", "中国"));

            using (var context = new Context())
            {
                Context.SetValue(_DepencyData1, 10000);

                Assert.Equal(10000,_DepencyData1.GetData("张三", "中国"));
                Assert.Equal(2, _DepencyData2.GetData("张三", "中国"));

                using (var context2=new Context())
                {
                    Assert.Equal(10000, _DepencyData1.GetData("张三", "中国"));
                    Assert.Equal(2, _DepencyData2.GetData("张三", "中国"));

                    Context.SetValue(_DepencyData1,20000);

                    Assert.Equal(20000, _DepencyData1.GetData("张三", "中国"));
                    Assert.Equal(2, _DepencyData2.GetData("张三", "中国"));
                }

                Assert.Equal(10000,_DepencyData1.GetData("张三", "中国"));
                Assert.Equal(2,_DepencyData2.GetData("张三", "中国"));
            }

            Assert.Equal(100,_DepencyData1.GetData("张三", "中国"));
            Assert.Equal(2,_DepencyData2.GetData("张三", "中国"));
        }
    }
}

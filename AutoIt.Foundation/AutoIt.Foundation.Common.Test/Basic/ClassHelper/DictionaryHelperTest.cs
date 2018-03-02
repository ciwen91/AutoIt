using System.Collections.Generic;
using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class DictionaryHelperTest : UnitTestBase
    {
        private Dictionary<string, int> _Dic = new Dictionary<string, int>()
        {
            {"A", 1}
        };

        public DictionaryHelperTest(ITestOutputHelper output) : base(output)
        {
        }


        [Theory]
        [InlineData("A",1)]
        [InlineData("B", 0)]
        public void Get(string key,int expected)
        {
            Assert.Equal(expected, _Dic.Get(key));
        }

        [Theory]
        [InlineData("A",1)]
        [InlineData("B",3)]
        public void GetOrSet(string key,int expected)
        {
            Assert.Equal(_Dic.GetOrSet(key, () => 3), expected);

            Assert.Contains(key,_Dic.Keys);
        }
    }
}
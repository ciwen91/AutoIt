using System;
using AutoIt.Foundation.Common.Context;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class DepencyDataTest
    {
        private ITestOutputHelper _Output;

        public DepencyDataTest(ITestOutputHelper output)
        {
            _Output = output;
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        public void Test(int a)
        {
            var depency = new DependcyData<int>();

            Console.WriteLine("01");
            _Output.WriteLine(depency.GetData().ToString());
        }
    }
}

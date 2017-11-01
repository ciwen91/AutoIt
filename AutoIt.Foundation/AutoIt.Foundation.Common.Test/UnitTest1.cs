using System;
using AutoIt.Foundation.Common.Context;
using Xunit;

namespace AutoIt.Foundation.Common.Test
{
    public class DepencyDataTest
    {
        [Theory]
        public void Test(int a)
        {
            var depency = new DependcyData<int>();

            Console.WriteLine(depency.GetData());
        }
    }
}

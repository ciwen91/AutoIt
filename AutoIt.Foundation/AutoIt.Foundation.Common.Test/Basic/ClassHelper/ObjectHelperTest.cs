using System;
using System.Linq;
using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class ObjectHelperTest : UnitTestBase
    {
        public ObjectHelperTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void AsEnumerable()
        {
            var exp = new Exception("MsgA", new Exception("MsgB"));

            var group = exp.AsEnumerable(item => item.InnerException)
                .ToList();

            Assert.Equal("MsgA,MsgB", group.JoinStr(",", item => item.Message));

        }
    }
}
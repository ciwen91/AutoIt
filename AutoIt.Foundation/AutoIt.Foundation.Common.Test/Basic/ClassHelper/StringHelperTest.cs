using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class StringHelperTest : UnitTestBase
    {
        private string _Str = @"abc
123456";

        public StringHelperTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void NextPoint()
        {
            var next = _Str.NextPoint(new LinePoint(1, 1, 0), 6);
            Assert.Equal(new LinePoint(7, 2, 1), next);
        }

        [Fact]
        public void PrePoint()
        {
            var next = _Str.PrePoint(new LinePoint(7, 2, 1), 6);
            Assert.Equal(new LinePoint(1, 1, 0), next);
        }

        [Fact]
        public void MatchNext()
        {
            var next = _Str.MatchNext(@"\d+", 7);

            Assert.Equal("3456", next);
        }

        [Fact]
        public void MatchPre()
        {
            var next = _Str.MatchPre(@"\d+", 7);

            Assert.Equal("123", next);
        }
    }
}
using Xunit.Abstractions;

namespace AutoIt.Foundation.Store.Test
{
    public abstract class TestBase
    {
        private ITestOutputHelper _Output;

        public TestBase(ITestOutputHelper output)
        {
            _Output = output;
        }

        protected void WriteLine(object obj)
        {
            _Output.WriteLine(obj.ToString());
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test.Core
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

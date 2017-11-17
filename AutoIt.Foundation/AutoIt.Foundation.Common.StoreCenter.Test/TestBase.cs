using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Common;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Store.Test
{
    public abstract class TestBase
    {
        private ITestOutputHelper _Output;

        public TestBase(ITestOutputHelper output)
        {
            _Output = output;
            LogHelper.WriteLineAction = str => output.WriteLine(str);
        }

        ~TestBase()
        {
            _Output = null;
            LogHelper.WriteLineAction = null;
        }

        protected static List<CaseInfoBase> _CaseGroup=new List<CaseInfoBase>();
       
        public static T GetCaseInfo<T>(string caseName) where T : CaseInfoBase
        {
            var caseInfo = (T) _CaseGroup.First(item => item.CaseName == caseName);

            return caseInfo;
        }
    }
}
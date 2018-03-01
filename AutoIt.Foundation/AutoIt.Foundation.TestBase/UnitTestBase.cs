using Xunit.Abstractions;

namespace AutoIt.Foundation.TestBase
{
    /// <summary>
    /// xUnit单元测试基类
    /// </summary>
    public abstract class UnitTestBase : ITestOutput
    {
        /// <summary>
        /// xUnit输出接口
        /// </summary>
        private readonly ITestOutputHelper _Output;

        /// <summary>
        /// 用例名称
        /// </summary>
        public string CaseName => this.GetType().Name
                                  + (string.IsNullOrEmpty(SubCaseName)  ? string.Empty : "." + SubCaseName);
        /// <summary>
        /// 子用例名称
        /// </summary>
        public string SubCaseName { get; set; }

        protected UnitTestBase(ITestOutputHelper output)
        {
            this._Output = output;
        }

        #region ITestOutput

        /// <summary>
        /// 输出函数
        /// </summary>
        /// <param name="str">输出内容</param>
        /// <param name="caseName">用例名称</param>
        public void WriteLine(object obj, string caseName = null)
        {
            _Output?.WriteLine(obj.ToString());
        }

        #endregion
    }
}
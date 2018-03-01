using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.TestBase
{
    /// <summary>
    /// 输出接口
    /// </summary>
    public interface ITestOutput
    {
        /// <summary>
        /// 输出信息
        /// </summary>
        /// <param name="obj">输出内容</param>
        /// <param name="caseName">用例名称</param>
        void WriteLine(object obj, string caseName = null);
    }
}

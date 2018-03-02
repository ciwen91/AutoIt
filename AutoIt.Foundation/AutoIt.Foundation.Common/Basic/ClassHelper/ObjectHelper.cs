using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// 对象帮助类
    /// </summary>
    public static class ObjectHelper
    {
        /// <summary>
        /// 将对象转为可枚举类型
        /// </summary>
        /// <param name="nextFunc">根据当前对象获取下一个对象</param>
        public static IEnumerable<T> AsEnumerable<T>(this T obj,Func<T,T> nextFunc) where T:class
        {
            while (obj != null)
            {
                yield return obj;
                obj = nextFunc(obj);
            }
        }
    }
}

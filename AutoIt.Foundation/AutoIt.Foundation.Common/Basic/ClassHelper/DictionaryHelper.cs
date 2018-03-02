using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// 字典帮助类
    /// </summary>
    public static class DictionaryHelper
    {
        /// <summary>
        /// 获取值(不存在时返回默认值)
        /// </summary>
        public static TValue Get<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key)
        {
            TValue value;
            dic.TryGetValue(key, out value);

            return value;
        }

        /// <summary>
        /// 获取值,没有时设置值
        /// </summary>
        public static TValue GetOrSet<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key,Func<TValue> dftValFunc)
        {
            TValue value;

            if (!dic.TryGetValue(key, out value))
            {
                value = dftValFunc();
                dic.Add(key,value);
            }

            return value;
        }
    }
}

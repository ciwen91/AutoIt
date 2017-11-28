using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common.ClassHelper
{
    public static class DictionaryHelper
    {
        public static TValue Get<TKey, TValue>(this Dictionary<TKey, TValue> dic, TKey key)
        {
            TValue value;
            dic.TryGetValue(key, out value);

            return value;
        }

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

using System;
using System.Collections.Generic;

namespace AutoIt.Foundation.Common
{
    public static class KeyValueHelper
    {
        public static IKeyValue<TKey, TValue> ToKeyValue<TKey, TValue>(this IEnumerable<Dictionary<TKey, TValue>> group)
        {
            return new KeyValueForDicGroup<TKey, TValue>(group);
        }

        public static TValue GetOrSetValue<TKey, TValue>(this IKeyValue<TKey, TValue> keyValue, TKey key, TValue dftValue)
        {
            if (keyValue.Exsite(key))
            {
                return keyValue.Get(key);
            }
            else
            {
                keyValue.Set(key, dftValue);
                return dftValue;
            }
        }

        public static IKeyObjValue ToKeyObjValue(this IEnumerable<ObjDictionary> group)
        {
            return new KeyValueForObjDicGroup(group);
        }

        public static TValue GetOrSet<TValue>(this IKeyObjValue keyValue, TValue dftValue, string name = null)
        {
            var key = new Tuple<Type, string>(typeof(TValue), name);

            if (keyValue.Exsite(key))
            {
                return (TValue)keyValue.Get(key);
            }
            else
            {
                keyValue.Set(key, dftValue);
                return dftValue;
            }
        }
    }
}

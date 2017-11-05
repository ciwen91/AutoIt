using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace AutoIt.Foundation.Common
{
   public static class EnumerableHelper
    {
        public static IEnumerable<int> For(int num)
        {
            var group = new int[num];

            for (var i = 0; i < group.Length; i++)
            {
                group[i] = i;
            }

            return group;
        }

        public static string JoinStr<T>(this IEnumerable<T> group, string seperator)
        {
           return string.Join(seperator, group);
        }

        public static string JoinStr<T, TResult>(this IEnumerable<T> group, string seperator, Func<T, TResult> castFunc)
        {
            return string.Join(seperator, group.Select(castFunc));
        }


    }
}

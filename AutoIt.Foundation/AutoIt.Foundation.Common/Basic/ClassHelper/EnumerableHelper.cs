﻿using System;
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

        public static T FirstOrDefault<T>(T item, Func<T, T> nextFunc, Func<T, bool> whereFunc) where T : class
        {
            while (item != null)
            {
                if (whereFunc(item))
                {
                    return item;
                }

                item = nextFunc(item);
            }

            return null;
        }

        public static TResult FirstOrDefault<T, TResult>(this IEnumerable<T> group) where T : class where TResult:T
        {
            var elm = (TResult)group.FirstOrDefault<T>(item => item is TResult);
            return elm;
        }

        public static IEnumerable<T> Each<T>(this IEnumerable<T> group, Action<T> eachAction)
        {
            foreach (var item in group)
            {
                eachAction(item);
            }

            return group;
        }


        public static IEnumerable<T> EachWithPre<T>(this IEnumerable<T> group, Action<T,T> eachAction)
        {
            T pre = default(T);
            var i = 0;

            //从第二个开始遍历
            foreach (var item in group)
            {
                if (i > 0)
                {
                    eachAction(item, pre);
                }

                pre = item;
                i++;
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
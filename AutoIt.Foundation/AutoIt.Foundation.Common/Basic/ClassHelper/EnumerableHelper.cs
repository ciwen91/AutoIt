using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace AutoIt.Foundation.Common
{
   /// <summary>
   /// 可枚举类型帮助类
   /// </summary>
   public static class EnumerableHelper
    {
        /// <summary>
        /// 获取第一个子类型元素
        /// </summary>
        public static TResult FirstOrDefault<T,TResult>(this IEnumerable<T> group) where T : class where TResult : T
        {
            var elm = (TResult)group.FirstOrDefault<T>(item => item is TResult);
            return elm;
        }

        /// <summary>
        /// 获取第一个元素(下一个元素由nextFunc提供)
        /// </summary>
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

        /// <summary>
        /// 遍历所有元素
        /// </summary>
        public static IEnumerable<T> Each<T>(this IEnumerable<T> group, Action<T> eachAction)
        {
            foreach (var item in group)
            {
                eachAction(item);
            }

            return group;
        }

        /// <summary>
        /// 遍历第二个元素开始的所有元素
        /// </summary>
        /// <param name="eachAction">(当前元素,上一个元素)</param>
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

        /// <summary>
        /// 连接成字符串
        /// </summary>
        public static string JoinStr<T>(this IEnumerable<T> group, string seperator)
        {
           return string.Join(seperator, group);
        }

        /// <summary>
        /// 连接字符串
        /// </summary>
        /// <param name="castFunc">类型转换函数</param>
        public static string JoinStr<T, TResult>(this IEnumerable<T> group, string seperator, Func<T, TResult> castFunc)
        {
            return string.Join(seperator, group.Select(castFunc));
        }

        /// <summary>
        /// 构造长度为num的集合(0~num-1)
        /// </summary>
        public static IEnumerable<int> For(int num)
        {
            var group = new int[num];

            for (var i = 0; i < group.Length; i++)
            {
                group[i] = i;
            }

            return group;
        }
    }
}

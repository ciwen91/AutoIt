using System;
using System.Collections.Generic;
using System.Linq;

namespace StoreCenter
{
    public static class IEnumerableHelper
    {
        public static TResult DoInChain<T,TResult>(this IEnumerable<T> group,FuncForChain<T,TResult>  funcForChain)
        {
            Func<TResult> next = () => DoInChain(group.ToList().Skip(1), funcForChain);

            var result=funcForChain(group.First(), group.Count() > 1, next);

            return result;
        }
    }
}
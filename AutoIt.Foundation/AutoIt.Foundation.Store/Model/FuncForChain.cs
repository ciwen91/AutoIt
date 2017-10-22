using System;

namespace StoreCenter
{
    public delegate TResult FuncForChain<T, TResult>(T elm, bool hasNext, Func<TResult> next);
}
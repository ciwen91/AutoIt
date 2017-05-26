interface Func<TResult> {
    (): TResult;
}

interface FuncOne<T,TResult> {
    (t:T):TResult
}
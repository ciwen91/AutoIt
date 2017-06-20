//有返回值的委托
interface Func<TResult> {
    (): TResult;
}

interface FuncOne<T,TResult> {
    (t:T):TResult
}
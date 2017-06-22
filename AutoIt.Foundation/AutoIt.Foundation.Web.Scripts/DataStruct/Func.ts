//有返回值的委托
interface Func<TResult> {
    (): TResult;
}

interface FuncOne<T,TResult> {
    (t:T):TResult
}

interface FuncTwo<T1,T2,TResult> {
    (t1:T1,t2:T2):TResult
}
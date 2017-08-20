//没有返回值的委托
interface Action {
    ():void;
}

interface ActionOne<T> {
    (t1: T): void;
}

interface ActionTwo<T1,T2> {
    (t1:T1,t2:T2):void;
}
//没有返回值的委托
interface Action {
    ():void;
}

interface ActionOne<T> {
    (t1: T): void;
}
interface Action {
    ():void;
}

interface ActionOne<T> {
    (t1: T): void;
}
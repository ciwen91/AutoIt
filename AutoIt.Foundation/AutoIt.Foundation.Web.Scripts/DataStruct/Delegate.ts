class  DelegateOne<T> {
    public ActionGroup:List<ActionOne<T>>=new List<ActionOne<T>>();

    public Subscribe(action:ActionOne<T>) {
        this.ActionGroup.Set(action);
    }

    public UnSubscribe(action: ActionOne<T>) {
        this.ActionGroup.RemoveItem(action);
    }

    public Do(param:T) {
        for (var item of this.ActionGroup.ToArray()) {
            item(param);
        }
    }
}

class DelegateTwo<T1, T2> {
    public ActionGroup: List<ActionTwo<T1, T2>> = new List<ActionTwo<T1, T2>>();

    public Subscribe(action: ActionTwo<T1, T2>) {
        this.ActionGroup.Set(action);
    }

    public UnSubscribe(action: ActionTwo<T1, T2>) {
        this.ActionGroup.RemoveItem(action);
    }

    public Do(param1: T1, param2: T2) {
        for (var item of this.ActionGroup.ToArray()) {
            item(param1, param2);
        }
    }
}
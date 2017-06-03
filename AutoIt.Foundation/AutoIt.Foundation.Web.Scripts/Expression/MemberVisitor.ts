class MemberVisitor {
    GetValue(func: Func<any>) {
        return func();
    }

    SetValue(func: Func<any>, value: any): MemberVisitor {
        debugger;
        return this;//???
    }
}
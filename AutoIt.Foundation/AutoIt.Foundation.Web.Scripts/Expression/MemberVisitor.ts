class MemberVisitor {
    GetValue(func: Func<any>) {
        return func();
    }

    SetValue(func: FuncOne<any, any>, value: any): MemberVisitor {
        func(value);
        return this;
    }
}
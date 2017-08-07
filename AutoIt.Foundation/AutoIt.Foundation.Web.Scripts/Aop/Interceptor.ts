class Interceptor<T1,T2> {
    private _BefHandlerGroup: FuncOne<T1, [T1,boolean]>[] = [];
    private _AftHandlerGroup: FuncOne<[T2,T1], T2>[] = [];

    public SubBef(func: FuncOne<T1, [T1, boolean]>): Interceptor<T1, T2> {
        this._BefHandlerGroup.push(func);
        return this;
    }
    public SubBefForCast(func: FuncOne<T1,T1>) {
        return this.SubBef(p=>[func(p),true]);
    }
    public SubBefForValide(func: FuncOne<T1, boolean>) {
        return this.SubBef(p=>[p,func(p)]);
    }

    public SubAft(func: FuncOne<[T2,T1],T2>): Interceptor<T1, T2> {
        this._AftHandlerGroup.push(func);
        return this;
    }
    public SubAftForCast(func: FuncOne<T2,T2>) {
        return this.SubAft(([pResult,p])=>func(pResult));
    }

    public Do(func: FuncOne<T1, T2>, param: T1): T2 {
        //执行BefHandler,如果返回值为true则替换参数,否则停止执行并返回默认值,
        for (var itemBef of this._BefHandlerGroup) {
            var befResult = itemBef(param);
            param = befResult[0];

            if (!befResult[1]) {
                return None;  
            }
        }

        //执行函数
        var result = func(param);

        //执行AftHandler,并替换返回值
        for (var itemAft of this._AftHandlerGroup) {
            result = itemAft([result,param]);
        }

        //返回结果
        return result;
    }
}

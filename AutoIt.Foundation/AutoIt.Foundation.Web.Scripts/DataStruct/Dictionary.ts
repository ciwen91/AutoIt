//字典类
class Dictionary<TKey, TValue> {
    //数据
    private _Data: Tuple<TKey, TValue>[] = [];

    //获取元素个数
    public Count(): number {
        return this._Data.length;
    }

    //获取索引(键)
    private Index(key: TKey): number {
        var index= $.Enumerable.From(this._Data)
            .Select(item => item.Item1)
            .IndexOf(key);

        return index;
    }

    //获取值(键,默认值)
    public Get(key: TKey, dft?: TValue): TValue {
        var index = this.Index(key);

        if (index < 0) {
            //返回默认值或None
            if (dft) {
                this.Set(key, dft);
                return dft;
            } else {
                return <TValue>None;
            }
        } else {
            return this._Data[index].Item2;
        }
    }

    //设置值(键,值)
    public Set(key:TKey,val:TValue): Dictionary<TKey, TValue> {
        var index = this.Index(key);

        //插入值或更新值
        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        } else {
            this._Data[index].Item2 = val;
        }

        return this;
    }

    //删除项(键)
    public Remove(key: TKey): Dictionary<TKey, TValue> {
        var index = this.Index(key);

        if (index >= 0) {
            this._Data.splice(index, 1);
        }

        return this;
    }

    //转换为数组
    public ToArray(): Tuple<TKey, TValue>[] {
        return this._Data.concat([]);
    } 
}
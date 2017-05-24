class Dictionary<TKey,TValue> {
    private _Data: Tuple<TKey, TValue>[] = [];

    public Count(): number {
        return this._Data.length;
    }

    private Index(key: TKey): number {
        var index= $.Enumerable.From(this._Data)
            .Select(item => item.Item1)
            .IndexOf(key);

        return index;
    }

    public Get(key: TKey): TValue {
        var index = this.Index(key);

        return index >= 0 ? this._Data[index].Item2 : <TValue>None;
    }

    public Set(key:TKey,val:TValue): Dictionary<TKey, TValue> {
        var index = this.Index(key);

        if (index < 0) {
            this._Data.push(new Tuple(key, val));
        } else {
            this._Data[index].Item2 = val;
        }

        return this;
    }

    public Remove(key: TKey): Dictionary<TKey, TValue> {
        var index = this.Index(key);

        if (index >= 0) {
            this._Data.splice(index, 1);
        }

        return this;
    }

    public ToArray(): Tuple<TKey, TValue>[] {
        return this._Data.concat([]);
    } 
}
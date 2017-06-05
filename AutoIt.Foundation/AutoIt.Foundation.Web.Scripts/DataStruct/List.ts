class  List<T> {
    private _Data: T[]=[];

    public Count(): number {
        return this._Data.length;
    }

    public Contains(val: T):boolean {
        return $.Enumerable.From(this._Data)
            .Any(item => item == val);
    }

    public Get(index?: number): T {
        if (!index) {
            index = this.Count() - 1;
        }

        return  this._Data[index];
    }

    public Set(val: T, index?: number): List<T> {
        if (!index) {
            index = this.Count();
        }

        this._Data[index] = val;
               
        return this;
    }

    public Remove(index?: number): T {
        if (!index) {
            index = this.Count() - 1;
        }

        var group = this._Data.splice(index, 0);

        return group[0];
    }

    public ToArray(): T[] {
        return this._Data.concat([]);
    } 
}
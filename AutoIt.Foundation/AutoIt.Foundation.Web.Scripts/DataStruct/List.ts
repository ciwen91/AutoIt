class  List<T> {
    private _Data: T[]=[];

    public Count(): number {
        return this._Data.length;
    }

    public Get(index: number): T {
        return  this._Data[index];
    }

    public Set(val: T, index?: number): List<T> {
        if (!index) {
            index = this.Count();
        }

        this._Data[index] = val;
               
        return this;
    }

    public Remove(val: T, index?: number): List<T> {
        if (!index) {
            index = this.Count() - 1;
        }

        this._Data.splice(index,0);

        return this;
    }

    public ToArray(): T[] {
        return this._Data.concat([]);
    } 
}
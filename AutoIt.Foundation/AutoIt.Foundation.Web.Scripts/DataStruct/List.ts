class  List<T> {
    private _Data: T[]=[];

    public Count(): number {
        return this._Data.length;
    }

    public Index(val: T): number {
        return this._Data.indexOf(val);
    }

    public Contains(val: T):boolean {
        return this.Index(val) >= 0;
    }

    public Get(index?: number): T {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }

        return  this._Data[index];
    }

    public Set(val: T, index?: number): List<T> {
        if (typeof (index) == "undefined") {
            index = this.Count();
        }

        this._Data.splice(index, 0, val);

        return this;
    }

    public SetRange(group: List<T>,index?:number):List<T> {
        $.Enumerable.From(group.ToArray().reverse()).ForEach(item => {
            this.Set(item, index);
        });
      
        return this;
    }

    public Remove(index?: number): T {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }

        var group = this._Data.splice(index,1);

        return group[0];
    }

    public RemoveItem(item: T): T {
        var index = this.Index(item);

        if (index >= 0) {
            this.Remove(index);
        }

        return item;
    }

    public Clear(): List<T> {
        this._Data = [];
        return this;
    }

    public ToArray(): T[] {
        return this._Data.concat([]);
    } 
}
//列表
class List<T> {
    //数据
    private _Data: T[] = [];

    constructor(group?: T[]) {
        if (typeof group != "undefined") {
            this._Data = group;
        }
    }

    //获取元素个数
    public Count(): number {
        return this._Data.length;
    }

    //获取元素索引
    public Index(val: T): number {
        return this._Data.indexOf(val);
    }

    //是否包含元素
    public Contains(val: T):boolean {
        return this.Index(val) >= 0;
    }

    //获取元素(索引:默认最后一个元素)
    public Get(index?: number): T {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }

        return  this._Data[index];
    }

    //插入元素(元素,索引:默认插入到最后)
    public Set(val: T, index?: number): List<T> {
        if (typeof (index) == "undefined") {
            index = this.Count();
        }

        this._Data.splice(index, 0, val);

        return this;
    }

    //插入元素集合(元素集合,索引:默认最后位置)
    public SetRange(group: List<T>, index?: number): List<T> {
        //前面的元素后插入
        $.Enumerable.From(group.ToArray().reverse()).ForEach(item => {
            this.Set(item, index);
        });
      
        return this;
    }

    //移除元素(索引:默认最后位置)
    public Remove(index?: number): T {
        if (typeof (index) == "undefined") {
            index = this.Count() - 1;
        }

        var group = this._Data.splice(index,1);

        return group[0];
    }

    //移除元素(元素)
    public RemoveItem(item: T): T {
        var index = this.Index(item);

        if (index >= 0) {
            this.Remove(index);
        }

        return item;
    }

    //清空列表
    public Clear(): List<T> {
        this._Data = [];
        return this;
    }

    //转换为数组
    public ToArray(): T[] {
        return this._Data.concat([]);
    } 

    //转换为枚举
    public ToEnumerble():linq.Enumerable<T> {
        return $.Enumerable.From(this.ToArray());
    }
}
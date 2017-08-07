class Table<T> {
    ColCount: number;

    private Data: T[][] = [];
    Pos: LinePoint = LinePoint.Empty;

    constructor(colCount: number) {
        this.ColCount = colCount;
    }

    Add(size: Size, obj: T): Table<T> {
        size = DeepClone(size);
        size.Width = Math.min(size.Width, this.ColCount);

        //查找新的Point
        this.Pos = this.Mark(this.Pos, size, obj);

        return this;
    }

    private Mark(point: LinePoint, size: Size, obj: T): LinePoint {
        //如果超过长度则转到下一行
        if (point.X + size.Width > this.ColCount) {
            return this.Mark(new LinePoint(point.Index, point.Y + 1, 0), size, obj);
        }

        //从当前位置开始,检查是否有Size大小的空间.如果没有则转到下一列
        for (var i = point.Y; i < point.Y + size.Height; i++) {
            this.EnsurRow(i);

            for (var j = point.X; j < point.X + size.Width; j++) {
                if (this.Data[i][j]) {
                    return this.Mark(new LinePoint(point.Index, point.X + 1, point.Y), size, obj);
                }
            }
        }

        //标记已被使用
        for (var i = point.Y; i < point.Y + size.Height; i++) {
            for (var j = point.X; j < point.X + size.Width; j++) {
                this.Data[i][j] = obj;
            }
        }

        //返回下一个元素的起始坐标
        return new LinePoint(point.Index + 1, point.X + size.Width, point.Y);
    }

    private EnsurRow(row: number): Table<T> {
        if (!this.Data[row]) {
            this.Data[row] = [];
        }

        return this;
    }
}
class LinePoint {
    Index: number;
    X: number;
    Y: number;

    constructor(index: number, x: number, y: number) {
        this.Index = index;
        this.X = x;
        this.Y = y;
    }

    Compare(linePoint: LinePoint): number {
        if (this.Y != linePoint.Y) {
            return this.Y > linePoint.Y ? 1 : -1;
        }
        else if (this.X != linePoint.X) {
            return this.X > linePoint.X ? 1 : -1;
        }
        else {
            return 0;
        }
    }
}
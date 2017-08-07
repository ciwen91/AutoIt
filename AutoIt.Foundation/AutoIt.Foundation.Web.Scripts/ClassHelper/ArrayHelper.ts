class ArrayHelper {
    public static FromInt(from: number, to: number): number[] {
        var group = [];

        for (var i = from; i <= to; i++) {
            group.push(i);
        }

        return group;
    }
}
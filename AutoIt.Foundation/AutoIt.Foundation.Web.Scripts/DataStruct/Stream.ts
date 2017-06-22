//Base64流
class Stream {
    //字节列表
    ByteGroup: List<number>;
    //当前位置
    Position: number=0;

    constructor(str: string) {
        this.ByteGroup = Base64ToByte(str);
    }

    //读取一个字节
    ReadByte(): number {
        var byte = this.ByteGroup.Get(this.Position);
        this.Position += 1; 
 
        return byte;
    }

    //是否可以往后读
    CanRead(): boolean {
        return this.Position < this.ByteGroup.Count();
    }
}
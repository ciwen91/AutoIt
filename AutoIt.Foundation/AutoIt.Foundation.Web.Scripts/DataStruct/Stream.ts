//二进制流
class Stream {
    //字符串
    Str: string;
    //当前位置
    Position: number=0;

    constructor(str:string) {
        this.Str = str;
    }

    //读取一个字节
    ReadByte(): number {
        //将8位二进制字符串转换为byte
        var byteStr = this.Str.substr(this.Position, 8);
        var byte = parseInt(byteStr, 2);

        this.Position += 8;

        return byte;
    }
}
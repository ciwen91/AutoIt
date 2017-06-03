class Stream {
    Str: string;
    Position: number=0;

    constructor(str:string) {
        this.Str = str;
    }

    ReadByte(): number {
        var byteStr = this.Str.substr(this.Position, 8);
        var byte = parseInt(byteStr, 2);

        this.Position += 8;

        return byte;
    }
}
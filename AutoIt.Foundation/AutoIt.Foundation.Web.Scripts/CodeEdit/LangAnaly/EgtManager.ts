namespace CodeEdit.LangAnaly {
    export class  EgtManager {
        Info: string;
        CharSetGroup = new List<Model.CharSet>();
        SymbolGroup = new List<Model.Symbol>();
        GroupGroup = new List<Model.Group>();
        ProduceGroup = new List<Model.Produce>();
        DFAStateGroup = new List<Model.DFAState>();
        LALRStateGroup=new List<Model.LALRState>();

        static CreateFromStr(str: string) {
            Context.Do(() => {
                var manager = new EgtManager();


            });
        }

        //#region Base
        ReadEntity(stream:Stream):Object {
            var type = this.ReadNum(stream, 1);

            if (type == 69) {
                return null;
            }
            else if (type == 98) {
                return this.ReadNum(stream, 1);
            }
            else if (type == 66) {
                return this.ReadNum(stream, 1) == 1;
            }
            else if (type == 73) {
                return this.ReadNum(stream, 2);
            }
            else if (type == 83) {
                return this.ReadString(stream);
            }
            else {
                throw "Unkonw Type!";
            }
        }

        ReadString(stream: Stream): string {
            var str = "";

            while (true) {
                var num = this.ReadNum(stream, 2);
                if (num > 0) {
                    str += num.toString(); //??? ToChar
                } else {
                    break;
                }
            }

            return str;
        }

        ReadNum(stream: Stream,digits:number): number {
            var num = 0;

            for (var i = 0; i < digits; i++) {
                num += stream.ReadByte() << (i * 8);
            }

            return num;
        }
       //#endregion
    }
}
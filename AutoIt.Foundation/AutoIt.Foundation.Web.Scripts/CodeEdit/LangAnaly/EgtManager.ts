namespace CodeEdit.LangAnaly {

    export class  EgtManager {
        Info: string;
        PropDic=new Dictionary<string,string>();
        CharSetGroup = new List<Model.CharSet>();
        SymbolGroup = new List<Model.Symbol>();
        GroupGroup = new List<Model.Group>();
        ProduceGroup = new List<Model.Produce>();
        DFAStateGroup = new List<Model.DFAState>();
        LALRStateGroup=new List<Model.LALRState>();

        static CreateFromStr(str: string): EgtManager {
            var manager = new EgtManager();
            var stream = new Stream(str);

            Context.Do(() => {
                manager.ReadInfo(stream);

                while (stream.Position<str.length) {
                    manager.ReadRecord(stream);
                }
            });

            Binding.Update();

            return manager;
        }

        ReadInfo(stream: Stream) {
            this.Info = this.ReadString(stream);
        }

        ReadRecord(stream: Stream) {
            var recordType =this.ReadNum(stream, 1);
            var entityNum = this.ReadNum(stream, 2);
            var dataType = <number>this.ReadEntity(stream);
            entityNum -= 1;

            if (dataType == 112) {
                this.ReadProp(stream);
            }
            else if (dataType == 116) {
                this.ReadTableCount(stream);
            }
            else if (dataType == 99) {
                this.ReadCharSet(stream);
            }
            else if (dataType == 83) {
                this.ReadSymbol(stream);
            }
            else if (dataType == 103) {
                this.ReadGroup(stream);
            }
            else if (dataType == 82) {
                this.ReadProduce(stream, entityNum);
            }
            else if (dataType == 73) {
                this.ReadInitState(stream);
            }
            else if (dataType == 68) {
                this.ReadDFAState(stream, entityNum);
            }
            else if (dataType == 76) {
                this.ReadLALRState(stream, entityNum);
            }
            else {
                for (var i = 0; i < entityNum; i++) {
                    this.ReadEntity(stream);
                }
            }
        }

        //#region Prop、TableCount
        ReadProp(stream: Stream) {
            var index = <number> this.ReadEntity(stream);
            var name = <string>this.ReadEntity(stream);
            var val = <string> this.ReadEntity(stream);

            this.PropDic.Set(name, val);
        }

        ReadTableCount(stream: Stream) {
            var symbolCnt = <number>this.ReadEntity(stream);
            var charSetCnt = <number>this.ReadEntity(stream);
            var ruleCnt = <number>this.ReadEntity(stream);
            var dfaCnt = <number>this.ReadEntity(stream);
            var lalrCnt = <number>this.ReadEntity(stream);
            var groupCnt = <number>this.ReadEntity(stream);
        }
        //#endregion

        //#region CharSet、Symbol、Group、Produce
        ReadCharSet(stream:Stream)
    {
        var index = <number> this.ReadEntity(stream);
        var unicodePlane = <number> this.ReadEntity(stream);
        var rangeCount =  <number>this.ReadEntity(stream);
        var reserve = this.ReadEntity(stream);

        var charSet = new Model.CharSet();
        charSet.ID = index;
        charSet.Group = Loop.For(rangeCount)
            .Select(item => InitObj(new Model.CharSetItem(),
                obj => {
                    obj.Start = <number>this.ReadEntity(stream),
                        obj.End = <number>this.ReadEntity(stream)
                }))
            .ToList();
        this.CharSetGroup.Set(charSet);
    }

        ReadSymbol(stream: Stream) {
            var index = <number>this.ReadEntity(stream);
            var name = <string> this.ReadEntity(stream);
            var symbolType = <Model.SymbolType> this.ReadEntity(stream);

            var symbol = new Model.Symbol();
            symbol.ID = index;
            symbol.Name = name;
            symbol.Type = symbolType;

            this.SymbolGroup.Set(symbol);
        }

        ReadGroup(stream: Stream) {
            var index = <number> this.ReadEntity(stream);
            var name = <string> this.ReadEntity(stream);
            var containerIndex = <number> this.ReadEntity(stream);
            var startIndex = <number> this.ReadEntity(stream);
            var endIndex = <number> this.ReadEntity(stream);
            var advanceMode = <number> this.ReadEntity(stream);
            var endingMode = <number> this.ReadEntity(stream);
            var reserve = this.ReadEntity(stream);
            var nestCount = <number> this.ReadEntity(stream);

            var nestGroup = Loop.For(nestCount)
                .Select(item => <number> this.ReadEntity(stream))
                .ToList();

            var group = new Model.Group();
            group.ID = index;
            group.Name = name;
            group.Container = this.SymbolGroup[containerIndex];
            group.Start = this.SymbolGroup[startIndex];
            group.End = this.SymbolGroup[endIndex];
            group.AdvanceMode = <Model.AdvanceMode> advanceMode;
            group.EndingMode = <Model.EndingMode> endingMode,
                group.NestGroup = Loop.For(nestCount)
                    .Select(item => <number> this.ReadEntity(stream))
                    .Select(item => this.SymbolGroup[item])
                    .ToList();

            this.GroupGroup.Set(group);
        }

        ReadProduce(stream: Stream, entityNum: number) {
            var index = <number> this.ReadEntity(stream);
            var nonIndex = <number> this.ReadEntity(stream);
            var reserve = this.ReadEntity(stream);
            entityNum -= 3;

            var produce = new Model.Produce();
            produce.ID = index;
            produce.NonTerminal = this.SymbolGroup.Get(nonIndex);
            produce.SymbolGroup = Loop.For(entityNum)
                .Select(item => <number> this.ReadEntity(stream))
                .Select(item => this.SymbolGroup.Get(item))
                .ToList();

            this.ProduceGroup.Set(produce);
        }
        //#endregion

        //#region InitState、DFAState、LALRState
        ReadInitState(stream: Stream) {
            var dfaIndex = <number> this.ReadEntity(stream);
            var lalrIndex = <number>this.ReadEntity(stream);
        }

        ReadDFAState(stream: Stream, entityNum: number) {
            var index = <number> this.ReadEntity(stream);
            var isAcceptState = <boolean> this.ReadEntity(stream);
            var acceptIndex = <number> this.ReadEntity(stream);
            var reserve = this.ReadEntity(stream);
            entityNum -= 4;

            var dfaState = new Model.DFAState();
            dfaState.ID = index,
                dfaState.AcceptSymbol = isAcceptState ? this.SymbolGroup.Get(acceptIndex) : null,
                dfaState.EdgGroup = Loop.For(entityNum / 3)
                    .Select(item => {
                        var edge = new Model.DFAEdge();

                        edge.CharSet = this.CharSetGroup.Get(<number>this.ReadEntity(stream));
                        var dfaStateIndex = <number> this.ReadEntity(stream);
                        var reserve2 = this.ReadEntity(stream);

                        Binding.Bind(val => edge.TargetState = val, () => this.DFAStateGroup.Get(dfaStateIndex));

                        return edge;
                    })
                    .ToList();

            this.DFAStateGroup.Set(dfaState);
        }

        ReadLALRState(stream: Stream, entityNum: number) {
            var index = <number> this.ReadEntity(stream);
            var reserve = this.ReadEntity(stream);
            entityNum -= 2;

            var lalrState = new Model.LALRState();
            lalrState.ID = index;
            lalrState.ActionGroup = Loop.For(entityNum / 4)
                .Select(item => {
                    var elm = new Model.LALRAction();

                    var symbolIndex = <number> this.ReadEntity(stream);
                    elm.Symbol = this.SymbolGroup.Get(symbolIndex);
                    elm.ActionType = <Model.ActionType> this.ReadEntity(stream);
                    var targetIndex = <number> this.ReadEntity(stream);
                    var reserve2 = this.ReadEntity(stream);

                    if (elm.ActionType == Model.ActionType.Shift || elm.ActionType == Model.ActionType.Goto) {
                        Binding.Bind(val => elm.TargetState = val, () => this.LALRStateGroup.Get(targetIndex)); 
                    } else if (elm.ActionType == Model.ActionType.Reduce) {
                        elm.TargetRule = this.ProduceGroup.Get(targetIndex);
                    }

                    return elm;
                })
                .ToList();

            this.LALRStateGroup.Set(lalrState);
        }
        //#endregion

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
                    str += String.fromCharCode(num); 
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
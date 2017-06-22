namespace CodeEdit.LangAnaly {
    //存储Egt信息
    export class EgtStorer {
        //语法信息
        Info: string;
        //属性集合
        PropDic=new Dictionary<string,string>();
        //字符集合
        CharSetGroup = new List<Model.CharSet>();
        //符号集合
        SymbolGroup = new List<Model.Symbol>();
        //分组集合
        GroupGroup = new List<Model.Group>();
        //产生式集合
        ProduceGroup = new List<Model.Produce>();
        //DFA状态集合
        DFAStateGroup = new List<Model.DFAState>();
        //LALR状态集合
        LALRStateGroup=new List<Model.LALRState>();

        //创建存储器
        static CreateFromStr(str: string): EgtStorer {
            var storer = new EgtStorer();
            var stream = new Stream(str);

            Context.Do(() => {
                //读取信息
                storer.ReadInfo(stream);

                //读取所有记录
                while (stream.CanRead()) {
                    storer.ReadRecord(stream);
                }

                //更新绑定信息 
                Binding.Update();
            });

            return storer;
        }

        //读取语法信息
        private  ReadInfo(stream: Stream) {
            this.Info = this.ReadString(stream);
        }

        //读取记录信息
        private  ReadRecord(stream: Stream) {
            //记录类型(暂时只有复杂类型)
            var recordType = this.ReadNum(stream, 1);
            //实体个数
            var entityNum = this.ReadNum(stream, 2);
            //记录类型(属性、符号等)
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
        //读取语法属性
        private ReadProp(stream: Stream) {
            //索引
            var index = <number> this.ReadEntity(stream);
            //名称
            var name = <string>this.ReadEntity(stream);
            //值
            var val = <string>this.ReadEntity(stream);

            this.PropDic.Set(name, val);
        }

        //读取集合元素个数
        private  ReadTableCount(stream: Stream) {
            var symbolCnt = <number>this.ReadEntity(stream);
            var charSetCnt = <number>this.ReadEntity(stream);
            var ruleCnt = <number>this.ReadEntity(stream);
            var dfaCnt = <number>this.ReadEntity(stream);
            var lalrCnt = <number>this.ReadEntity(stream);
            var groupCnt = <number>this.ReadEntity(stream);
        }
        //#endregion

        //#region CharSet、Symbol、Group、Produce
        //读取字符集
        private ReadCharSet(stream: Stream) {
            var index = <number> this.ReadEntity(stream);
            var unicodePlane = <number>this.ReadEntity(stream);
            //字符项个数
            var rangeCount = <number>this.ReadEntity(stream);
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

        //读取符号集
        private  ReadSymbol(stream: Stream) {
            var index = <number>this.ReadEntity(stream);
            //名称
            var name = <string>this.ReadEntity(stream);
            //类型
            var symbolType = <Model.SymbolType> this.ReadEntity(stream);

            var symbol = new Model.Symbol();
            symbol.ID = index;
            symbol.Name = name;
            symbol.Type = symbolType;

            this.SymbolGroup.Set(symbol);
        }

        //读取分组
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

        //读取产生式
        ReadProduce(stream: Stream, entityNum: number) {
            var index = <number>this.ReadEntity(stream);
            //产生式头部索引
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
        //读取初始状态
        ReadInitState(stream: Stream) {
            var dfaIndex = <number> this.ReadEntity(stream);
            var lalrIndex = <number>this.ReadEntity(stream);
        }

        //读取DFA集合
        ReadDFAState(stream: Stream, entityNum: number) {
            var index = <number>this.ReadEntity(stream);
            //是否为可接受状态
            var isAcceptState = <boolean>this.ReadEntity(stream);
            //接受符号的索引
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
                        //边对应的状态
                        var dfaStateIndex = <number> this.ReadEntity(stream);
                        var reserve2 = this.ReadEntity(stream);

                        Binding.Bind(val => edge.TargetState = val, () => this.DFAStateGroup.Get(dfaStateIndex));

                        return edge;
                    })
                    .ToList();

            this.DFAStateGroup.Set(dfaState);
        }

        //读取LALR集合
        ReadLALRState(stream: Stream, entityNum: number) {
            var index = <number> this.ReadEntity(stream);
            var reserve = this.ReadEntity(stream);
            entityNum -= 2;

            var lalrState = new Model.LALRState();
            lalrState.ID = index;
            lalrState.ActionGroup = Loop.For(entityNum / 4)
                .Select(item => {
                    var elm = new Model.LALRAction();

                    //边上的符号索引
                    var symbolIndex = <number> this.ReadEntity(stream);
                    elm.Symbol = this.SymbolGroup.Get(symbolIndex);
                    elm.ActionType = <Model.ActionType>this.ReadEntity(stream);
                    //边对应的状态或产生式
                    var targetIndex = <number> this.ReadEntity(stream);
                    var reserve2 = this.ReadEntity(stream);

                    if (elm.ActionType == Model.ActionType.Shift || elm.ActionType == Model.ActionType.Goto) {
                        //移入时读取目标状态
                        Binding.Bind(val => elm.TargetState = val, () => this.LALRStateGroup.Get(targetIndex)); 
                    } else if (elm.ActionType == Model.ActionType.Reduce) {
                        //规约时读取目标产生式
                        elm.TargetRule = this.ProduceGroup.Get(targetIndex);
                    }

                    return elm;
                })
                .ToList();

            this.LALRStateGroup.Set(lalrState);
        }
        //#endregion

        //#region Base
        //读取实体
        ReadEntity(stream:Stream):Object {
            var type = this.ReadNum(stream, 1);

            //Empty
            if (type == 69) {
                return null;
            }
            //Byte
            else if (type == 98) {
                return this.ReadNum(stream, 1);
            }
            //Bool
            else if (type == 66) {
                return this.ReadNum(stream, 1) == 1;
            }
            //int
            else if (type == 73) {
                return this.ReadNum(stream, 2);
            }
            //string
            else if (type == 83) {
                return this.ReadString(stream);
            }
            else {
                throw "Unkonw Type!";
            }
        }

        //读取字符串
        ReadString(stream: Stream): string {
            var str = "";

            while (true) {
                //0为字符串结尾
                var num = this.ReadNum(stream, 2);
                if (num > 0) {
                    //将数字转换为字符
                    str += String.fromCharCode(num); 
                } else {
                    break;
                }
            }

            return str;
        }

        //读取整数
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
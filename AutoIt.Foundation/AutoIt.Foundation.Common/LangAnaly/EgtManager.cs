using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.Bind;
using AutoIt.Foundation.Common.ClassHelper;
using AutoIt.Foundation.Common.LangAnaly.Model;
using Compiler.Common;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class EgtManager
    {
        public string Info { get; set; }
        public Dictionary<string, string> PropDic = new Dictionary<string, string>();
        public List<CharSet> CharSetGroup = new List<CharSet>();
        public List<Symbol> SymbolGroup = new List<Symbol>();
        public List<Group> GroupGroup = new List<Group>();
        public List<Produce> ProduceGroup = new List<Produce>();
        public List<DFAState> DFAStateGroup = new List<DFAState>();
        public List<LALRState> LALRStateGroup = new List<LALRState>();

        public static EgtManager CreateFromFile(string filePath)
        {
            using (Context contex = new Context())
            {
                var manager = new EgtManager();

                using (var stream = File.Open(filePath, FileMode.Open))
                {
                    manager.ReadInfo(stream);

                    while (stream.Position < stream.Length)
                    {
                        manager.ReadRecord(stream);
                    }
                }

                Binding.Update();

                return manager;
            }
        }

        void ReadInfo(Stream stream)
        {
            Info = ReadString(stream);
        }

        void ReadRecord(Stream stream)
        {
            var recordType = ReadNum(stream, 1);
            var entityNum = ReadNum(stream, 2);
            var dataType = (int) ReadEntity(stream);
            entityNum -= 1;

            if (dataType == 112)
            {
                ReadProp(stream);
            }
            else if (dataType == 116)
            {
                ReadTableCount(stream);
            }
            else if (dataType == 99)
            {
                ReadCharSet(stream);
            }
            else if (dataType == 83)
            {
                ReadSymbol(stream);
            }
            else if (dataType == 103)
            {
                ReadGroup(stream);
            }
            else if (dataType == 82)
            {
                ReadProduce(stream, entityNum);
            }
            else if (dataType == 73)
            {
                ReadInitState(stream);
            }
            else if (dataType == 68)
            {
                ReadDFAState(stream, entityNum);
            }
            else if (dataType == 76)
            {
                ReadLALRState(stream, entityNum);
            }
            else
            {
                for (var i = 0; i < entityNum; i++)
                {
                    ReadEntity(stream);
                }
            }

        }

        #region Prop、TableCount

        void ReadProp(Stream stream)
        {
            var index = (int) ReadEntity(stream);
            var name = (string) ReadEntity(stream);
            var val = (string) ReadEntity(stream);

            PropDic.Add(name, val);
        }

        void ReadTableCount(Stream stream)
        {
            var symbolCnt = (int) ReadEntity(stream);
            var charSetCnt = (int) ReadEntity(stream);
            var ruleCnt = (int) ReadEntity(stream);
            var dfaCnt = (int) ReadEntity(stream);
            var lalrCnt = (int) ReadEntity(stream);
            var groupCnt = (int) ReadEntity(stream);
        }

        #endregion

        #region CharSet、Symbol、Group、Produce

        void ReadCharSet(Stream stream)
        {
            var index = (int) ReadEntity(stream);
            var unicodePlane = (int) ReadEntity(stream);
            var rangeCount = (int) ReadEntity(stream);
            var reserve = ReadEntity(stream);

            var charSet = new CharSet()
            {
                ID = index,
                Group = EnumerableHelper.For(rangeCount)
                    .Select(item => new CharSetItem()
                    {
                        Start = (int) ReadEntity(stream),
                        End = (int) ReadEntity(stream)
                    }).ToList()
            };
            CharSetGroup.Add(charSet);
        }

        void ReadSymbol(Stream stream)
        {
            var index = (int) ReadEntity(stream);
            var name = (string) ReadEntity(stream);
            var symbolType = (SymbolType) ReadEntity(stream);

            var symbol = new Symbol()
            {
                ID = index,
                Name = name,
                Type = symbolType
            };

            SymbolGroup.Add(symbol);
        }

        void ReadGroup(Stream stream)
        {
            var index = (int) ReadEntity(stream);
            var name = (string) ReadEntity(stream);
            var containerIndex = (int) ReadEntity(stream);
            var startIndex = (int) ReadEntity(stream);
            var endIndex = (int) ReadEntity(stream);
            var advanceMode = (int) ReadEntity(stream);
            var endingMode = (int) ReadEntity(stream);
            var reserve = ReadEntity(stream);
            var nestCount = (int) ReadEntity(stream);

            var nestGroup = new string[nestCount]
                .Select(item => (int) ReadEntity(stream))
                .ToList();

            var group = new Group()
            {
                ID = index,
                Name = name,
                Container = SymbolGroup[containerIndex],
                Start = SymbolGroup[startIndex],
                End = SymbolGroup[endIndex],
                AdvanceMode = (AdvanceMode) advanceMode,
                EndingMode = (EndingMode) endingMode,
                NestGroup = EnumerableHelper.For(nestCount)
                    .Select(item => (int) ReadEntity(stream))
                    .Select(item => SymbolGroup[item])
                    .ToList()
            };

            GroupGroup.Add(group);
        }

        void ReadProduce(Stream stream, int entityNum)
        {
            var index = (int) ReadEntity(stream);
            var nonIndex = (int) ReadEntity(stream);
            var reserve = ReadEntity(stream);
            entityNum -= 3;

            var produce = new Produce()
            {
                ID = index,
                NonTerminal = SymbolGroup[nonIndex],
                SymbolGroup = EnumerableHelper.For(entityNum)
                    .Select(item => (int) ReadEntity(stream))
                    .Select(item => SymbolGroup[item])
                    .ToList()
            };
            ProduceGroup.Add(produce);
        }

        #endregion

        #region InitState、DFAState、LALRState

        void ReadInitState(Stream stream)
        {
            var dfaIndex = (int) ReadEntity(stream);
            var lalrIndex = (int) ReadEntity(stream);
        }

        void ReadDFAState(Stream stream, int entityNum)
        {
            var index = (int) ReadEntity(stream);
            var isAcceptState = (bool) ReadEntity(stream);
            var acceptIndex = (int) ReadEntity(stream);
            var reserve = ReadEntity(stream);
            entityNum -= 4;

            var dfaState = new DFAState()
            {
                ID = index,
                AcceptSymbol = isAcceptState ? SymbolGroup[acceptIndex] : null,
                EdgGroup = EnumerableHelper.For(entityNum/3)
                    .Select(item =>
                    {
                        var edge = new DFAEdge();

                        edge.CharSet = CharSetGroup[(int) ReadEntity(stream)];
                        var dfaStateIndex = (int) ReadEntity(stream);
                        var reserve2 = ReadEntity(stream);

                        Binding.Bind(() => edge.TargetState, () => DFAStateGroup[dfaStateIndex]);

                        return edge;
                    })
                    .ToList()
            };

            DFAStateGroup.Add(dfaState);
        }

        void ReadLALRState(Stream stream, int entityNum)
        {
            var index = (int) ReadEntity(stream);
            var reserve = ReadEntity(stream);
            entityNum -= 2;

            var lalrState = new LALRState()
            {
                ID = index,
                ActionGroup = EnumerableHelper.For(entityNum/4).Select(item =>
                    {
                        var elm = new LALRAction();

                        var symbolIndex = (int) ReadEntity(stream);
                        elm.Symbol = this.SymbolGroup[symbolIndex];
                        elm.ActionType = (ActionType) ReadEntity(stream);
                        var targetIndex = (int) ReadEntity(stream);
                        var reserve2 = ReadEntity(stream);

                        if (elm.ActionType == ActionType.Shift||elm.ActionType== ActionType.Goto)
                        {
                            Binding.Bind(() => elm.TargetState, () => LALRStateGroup[targetIndex]);
                        }
                        else if (elm.ActionType == ActionType.Reduce)
                        {
                            elm.TargetRule = ProduceGroup[targetIndex];
                        }

                        return elm;
                    })
                    .ToList()
            };

            LALRStateGroup.Add(lalrState);
        }

        #endregion

        #region Base

        object ReadEntity(Stream stream)
        {
            var type = ReadNum(stream, 1);

            if (type == 69)
            {
                return null;
            }
            else if (type == 98)
            {
                return ReadNum(stream, 1);
            }
            else if (type == 66)
            {
                return ReadNum(stream, 1) == 1;
            }
            else if (type == 73)
            {
                return ReadNum(stream, 2);
            }
            else if (type == 83)
            {
                return ReadString(stream);
            }
            else
            {
                throw new Exception("Unkonw Type!");
            }
        }

        int ReadNum(Stream stream, int digits)
        {
            var num = 0;

            for (var i = 0; i < digits; i++)
            {
                num += stream.ReadByte() << (i*8);
            }

            return num;
        }

        string ReadString(Stream stream)
        {
            var sb = new StringBuilder();

            while (true)
            {
                var num = ReadNum(stream, 2);
                if (num > 0)
                {
                    sb.Append(Convert.ToChar(num));
                }
                else
                {
                    break;
                }
            }

            return sb.ToString();
        }

        #endregion
    }
}

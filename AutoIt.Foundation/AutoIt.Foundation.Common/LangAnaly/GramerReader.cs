using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.ClassHelper;
using AutoIt.Foundation.Common.LangAnaly.Model;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class GramerReader
    {
        private EgtManager _EgtManager;
        private Stack<Tuple<LALRState, GramerInfo>> _GrammerGroup = new Stack<Tuple<LALRState, GramerInfo>>();

        public GramerReader(EgtManager edgManager)
        {
            this._EgtManager = edgManager;

            var topInfo = new Tuple<LALRState, GramerInfo>(edgManager.LALRStateGroup[0], null);
            _GrammerGroup.Push(topInfo);
        }

        public GramerInfo ReadGramer(TokenInfo tokenInfo)
        {
            var curStrate = _GrammerGroup.Peek().Item1;
            var action = curStrate.GetAction(tokenInfo.Symbol);

            if (action == null)
            {
                return new GramerInfo(GramerState.Error, tokenInfo);
            }
            else
            {
                if (action.ActionType == ActionType.Shift)
                {
                    var gramerSymbol = new GramerInfo(GramerState.Shift, tokenInfo);
                    _GrammerGroup.Push(new Tuple<LALRState, GramerInfo>(action.TargetState, gramerSymbol));

                    return gramerSymbol;
                }
                else if (action.ActionType == ActionType.Reduce)
                {
                    var produce = action.TargetRule;
                    var prodSymbolCount = produce.SymbolGroup.Count;

                    var group = EnumerableHelper.For(prodSymbolCount)
                        .Select(item => _GrammerGroup.Pop())
                        .Reverse()
                        .ToList();
                    var gramerSymbol = new GramerInfo(GramerState.Reduce,
                        group.Count > 0
                            ? group.First().Item2.StartToken
                            : new TokenInfo(TokenState.Accept, null, null, tokenInfo.Index, tokenInfo.Line,
                                tokenInfo.Col))
                    {
                        ChildGroup = group.Select(item => item.Item2).ToList(),
                        Value = group.JoinStr(string.Empty, item => item.Item2.Value),
                        Symbol = produce.NonTerminal,
                        Produce = produce
                    };

                    _GrammerGroup.Push(new Tuple<LALRState, GramerInfo>(_GrammerGroup.Peek().Item1.GetAction(produce.NonTerminal).TargetState, gramerSymbol));

                    return gramerSymbol;
                }
                else if (action.ActionType == ActionType.Accept)
                {
                    var gramerInfo = _GrammerGroup.Peek().Item2;

                    var gramerSymbol = new GramerInfo(GramerState.Accept, tokenInfo)
                    {
                        ChildGroup = new List<GramerInfo>() {gramerInfo},
                        Value =gramerInfo.Value,
                        Data = gramerInfo.Data
                    };

                    return gramerSymbol;
                }
                else
                {
                    throw new NotSupportedException();
                }
            }

        }
    }
}

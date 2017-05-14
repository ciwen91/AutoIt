namespace AutoIt.Foundation.Common.LangAnaly.Model
{
    public class GramerInfo : SymbolInfoBase
    {
        //public LALRAction Action { get; set; }
        public GramerInfo ChildGroup { get; set; }

        public GramerInfo(LALRAction action,
            string value, int line, int col) : base(action.Symbol, value, line, col)
        {
            //this.Action = action;
        }
    }
}
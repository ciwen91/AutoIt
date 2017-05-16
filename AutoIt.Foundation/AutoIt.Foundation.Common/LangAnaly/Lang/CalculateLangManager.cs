using AutoIt.Foundation.Common.LangAnaly.Model;

namespace AutoIt.Foundation.Common.LangAnaly
{
    public class CalculateLangManager : LangManagerBase
    {
        private GramerInfo _GramerInfo;

        public CalculateLangManager(string egtPath) : base(egtPath)
        {
        }

        public object GetValue(string val)
        {
            base.Analy(val);
            return _GramerInfo.Data;
        }

        public override void TokenRead(TokenInfo tokenInfo)
        {
            if (tokenInfo.Symbol.Name == "flotVal")
            {
                tokenInfo.Data = float.Parse(tokenInfo.Value);
            }
        }
    }
}
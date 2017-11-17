namespace AutoIt.Foundation.Store.Test
{
    public abstract class CaseInfoBase
    {
        public string CaseName { get; set; }

        protected CaseInfoBase(string caseName)
        {
            this.CaseName = caseName;
        }
    }
}
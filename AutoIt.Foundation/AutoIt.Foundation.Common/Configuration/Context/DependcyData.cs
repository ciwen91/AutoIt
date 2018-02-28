using System.Collections.Generic;
using System.Data.Odbc;
using System.Linq;
using System.Runtime.Remoting.Messaging;

namespace AutoIt.Foundation.Common
{
    public interface IKey
    {
        string Key { get; }
    }

    public class DependcyData<T>:IKey
    {
        public string Key => this.GetHashCode().ToString();
        public  T Default { get; set; }
        public  GetDataDelegate GetDataFunc { get; set; }

        public T GetData(object tag=null, string region=null)
        {
            var val = default(T);
            bool hasVal = false;

            #region Context

            val = Context.GetValue<T>(Key,out hasVal);

            if (hasVal)
            {
                return val;
            }

            #endregion

            #region GetDataFunc

            if (GetDataFunc != null)
            {
                val = GetDataFunc(tag, region, out hasVal);

                if (hasVal)
                {
                    return val;
                }
            }

            #endregion

            return Default;
        }
      
        public delegate T GetDataDelegate(object tag, string region, out bool hasValue);
    }
}
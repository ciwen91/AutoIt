using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common.Context
{

    public class DependcyData<T>
    {
        public string Key => this.GetHashCode().ToString();
        public static T Default { get; set; }
        public static GetDataDelegate GetDataFunc { get; set; }

        public T GetData(object tag=null, string region=null)
        {
            var val = default(T);
            bool hasVal = false;

            #region CallContext

            var contextData = (Stack<T>)CallContext.GetData(Key);

            if (contextData != null && contextData.Any())
            {
                val = contextData.Peek();
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

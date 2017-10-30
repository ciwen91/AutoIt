using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common.Context
{

    public class ContextData<T>
    {
        [ThreadStatic]
        private static Stack<T> _DataGroup;

        public static T Default { get; set; }

        public static Func<object,string,T> GetDataFunc { get; set; }

        public ContextData()
        {
            
        }

        public T GetData(object tag, string region)
        {
            var typeDft= default(T);
            var val = typeDft;

            val = GetDataFunc(tag, region);

            if (!val.Equals(typeDft))
            {
                return val;
            }

            var contextData = CallContext.GetData(tag.GetHashCode().ToString());

            if (contextData != null)
            {
                val = ((Stack<T>) contextData).Peek();
            }

            if (!val.Equals(typeDft))
            {
                return val;
            }

            return Default;
        }
    }
}

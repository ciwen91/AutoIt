using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{

    public class DependcyData<T>
    {
        public string Key => this.GetHashCode().ToString();
        public  T Default { get; set; }
        public  GetDataDelegate GetDataFunc { get; set; }

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

    public class Context:IDisposable
    {
        private Stack<Dictionary<string, object>> _Stack;
        private Dictionary<string,object> _Dic=new Dictionary<string, object>();
        public Context()
        {
  
           var obj= CallContext.GetData("_Context");

            if (obj == null)
            {
                obj = new Stack<Dictionary<string, object>>();
                CallContext.SetData("_Context", obj);
            }

            _Stack.Push(_Dic);
        }

        public T GetValue<T>(string key,out bool exists)
        {
             

            exists = false;

            return default(T);

        }

        public void SetValue<T>(string key,T value)
        {
            _Dic[key] = value;
        }

        public void Dispose()
        {
            _Stack.Pop();
        }
    }
}

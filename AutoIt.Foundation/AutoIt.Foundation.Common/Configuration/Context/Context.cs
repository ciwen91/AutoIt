using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    public class Context:IDisposable
    {
        private const string _Key = "_Context";

        private static Stack<Dictionary<string, object>> _Stack => (Stack<Dictionary<string, object>>) CallContext.GetData(_Key);

        private static Dictionary<string, object> _Dic => _Stack != null && _Stack.Any() ? _Stack.Peek() : null;

        public Context()
        {
            var stack = _Stack;

            if (stack == null)
            {
                var obj = new Stack<Dictionary<string, object>>();
                CallContext.SetData(_Key, obj);
                stack = obj;
            }

            var dic=new Dictionary<string,object>();
            stack.Push(dic);
        }

        public static T GetValue<T>(string key,out bool exists)
        {
           var dic= _Stack?.FirstOrDefault(item => item.ContainsKey(key));

            if (dic != null)
            {
                exists = true;
                return (T)dic[key];
            }

            exists = false;

            return default(T);
        }

     
        public static void SetValue<T>(string key,T value)
        {
            if (_Dic != null)
            {
                _Dic[key] = value;
            }
        }
        public static void SetValue<T>(IKey iKey, T value)
        {
            SetValue(iKey.Key, value);
        }

        public void Dispose()
        {
            _Stack.Pop();
        }
    }
}

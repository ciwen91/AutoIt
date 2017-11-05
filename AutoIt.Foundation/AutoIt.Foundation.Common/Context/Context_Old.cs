using System;
using System.Collections.Generic;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// 上下文相关类
    /// </summary>
    public class Context_Old : IDisposable
    {
        [ThreadStatic] private static Stack<ObjDictionary> _StackDic;

        public static IKeyObjValue Current
        {
            get { return _StackDic != null ? _StackDic.ToKeyObjValue() : null; }
        }

        public Context_Old()
        {
            if (_StackDic == null)
            {
                _StackDic = new Stack<ObjDictionary>();
            }

            _StackDic.Push(new ObjDictionary());
        }

        public void Dispose()
        {
            _StackDic.Pop();
        }
    }
}

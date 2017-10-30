using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.DataStruct;
using AutoIt.Foundation.Common.DataStruct.KeyValue;

namespace Compiler.Common
{
    /// <summary>
    /// 上下文相关类
    /// </summary>
    public class Context : IDisposable
    {
        [ThreadStatic] private static Stack<ObjDictionary> _StackDic;

        public static IKeyObjValue Current
        {
            get { return _StackDic != null ? _StackDic.ToKeyObjValue() : null; }
        }

        public Context()
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

using System;
using System.Collections.Generic;

namespace AutoIt.Foundation.Common.DataStruct
{
    public interface IKeyObjValue : IKeyValue<Tuple<Type, string>, object>
    {
        bool Exsite<T>(string name=null);
        T Get<T>(string name=null);
        IKeyObjValue Set<T>(T value,string name=null);
        IKeyObjValue Remove<T>(string name=null);
    }
}
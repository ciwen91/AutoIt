using System;
using StoreCenter.Core;

namespace StoreCenter.ProcCache
{
    public class ProcCacheFactory<T> : IDataMediaFactory<T> where T:EntityBase
    {
        public IDataMedia<T> Create(StoreShape shape)
        {
            if (shape == StoreShape.Dic)
            {
                return new ProcCacheForDic<T>();
            }
            else
            {
                return new ProcCacheForKeyValue<T>();
            }
        }
    }
}
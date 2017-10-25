using System;

namespace StoreCenter
{
    public class ProcCacheFactory<T> : IDataStoreFactory<T> where T:EntityBase
    {
        public IDataStore<T> Create(StoreShape shape)
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
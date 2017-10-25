using System;

namespace StoreCenter
{
    public class RedisCacheFactory<T> : IDataStoreFactory<T> where T : EntityBase
    {
        public IDataStore<T> Create(StoreShape shape)
        {
            if (shape == StoreShape.Dic)
            {
                return new RedisCacheForDic<T>();
            }
            else
            {  
                return new RedisCacheForKeyValue<T>();
            }
        }
    }
}
using System;

namespace AutoIt.Foundation.Store
{
    public class RedisCacheFactory : IDataStoreFactory
    {
        public StoreType StoreType
        {
            get { return StoreType.RedisCache; }
        }

        public StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase
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
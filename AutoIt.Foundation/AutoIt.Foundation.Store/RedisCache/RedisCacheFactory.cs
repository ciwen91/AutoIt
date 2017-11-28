using System;

namespace AutoIt.Foundation.Store
{
    public class RedisCacheFactory : DataStoreFactoryBase
    {
        public override StoreType StoreType
        {
            get { return StoreType.RedisCache; }
        }

        public override StoreBase<T> Create<T>(StoreShape shape)
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
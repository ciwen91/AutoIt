using System;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// Redis简单存储工厂
    /// </summary>
    public class RedisCacheFactory : SimpleStoreFactoryBase
    {
        /// <summary>
        /// 存储类型
        /// </summary>
        public override StoreType StoreType => StoreType.RedisCache;

        /// <summary>
        /// 创建简单存储
        /// </summary>
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
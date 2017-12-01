using System;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 进程内简单存储工厂
    /// </summary>
    public class ProcCacheFactory : SimpleStoreFactoryBase
    {
        /// <summary>
        /// 存储类型
        /// </summary>
        public override StoreType StoreType => StoreType.ProcCache;

        /// <summary>
        /// 创建简单存储
        /// </summary>
        public override StoreBase<T> Create<T>(StoreShape shape)
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
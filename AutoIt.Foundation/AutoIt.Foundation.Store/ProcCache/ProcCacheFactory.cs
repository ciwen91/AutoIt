using System;

namespace AutoIt.Foundation.Store
{
    public class ProcCacheFactory : SimpleStoreFactoryBase
    {
        public override StoreType StoreType { get { return StoreType.ProcCache; } }

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
using System;

namespace AutoIt.Foundation.Store
{
    public class ProcCacheFactory : IDataStoreFactory 
    {
        public StoreType StoreType { get { return StoreType.ProcCache; } }

        public StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase
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
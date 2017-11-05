using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StoreCenter;

namespace AutoIt.Foundation.StoreCenter.DBStore
{
    public class DBStoreFactory : IDataStoreFactory
    {
        public StoreType StoreType
        {
            get { return StoreType.DBStore; }
        }

        public StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase
        {
            return new EFStore<T>();
        }
    }
}

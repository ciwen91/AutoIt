namespace AutoIt.Foundation.Store
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

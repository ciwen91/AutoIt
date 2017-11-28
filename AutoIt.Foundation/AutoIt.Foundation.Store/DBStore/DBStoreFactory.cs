namespace AutoIt.Foundation.Store
{
    public class DBStoreFactory : DataStoreFactoryBase
    {
        public override StoreType StoreType
        {
            get { return StoreType.DBStore; }
        }

        public override StoreBase<T> Create<T>(StoreShape shape)
        {
            return new EFStore<T>();
        }
    }
}

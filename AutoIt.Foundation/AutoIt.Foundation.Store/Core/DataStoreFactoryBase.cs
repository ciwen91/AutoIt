namespace AutoIt.Foundation.Store
{
    public abstract class DataStoreFactoryBase
    {
        public abstract StoreType StoreType { get; }
        public abstract StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase;
    }
}
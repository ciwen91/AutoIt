namespace AutoIt.Foundation.Store
{
    public abstract class SimpleStoreFactoryBase
    {
        public abstract StoreType StoreType { get; }
        public abstract StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase;
    }
}
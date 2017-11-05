namespace AutoIt.Foundation.Store
{
    public interface IDataStoreFactory
    {
        StoreType StoreType { get; }
        StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase;
    }
}
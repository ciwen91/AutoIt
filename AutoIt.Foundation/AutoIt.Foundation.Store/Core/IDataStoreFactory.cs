namespace StoreCenter
{
    public interface IDataStoreFactory<T> where T : EntityBase
    {
        IDataStore<T> Create(StoreShape shape);
    }
}
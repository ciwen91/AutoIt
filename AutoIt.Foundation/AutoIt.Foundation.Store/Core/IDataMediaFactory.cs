namespace StoreCenter.Core
{
    public interface IDataMediaFactory<T> where T : EntityBase
    {
        IDataMedia<T> Create(StoreShape shape);
    }
}
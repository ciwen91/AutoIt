namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 数据库简单存储工厂 
    /// </summary>
    public class DBStoreFactory : SimpleStoreFactoryBase
    {
        /// <summary>
        /// 存储类型
        /// </summary>
        public override StoreType StoreType => StoreType.DBStore;

        /// <summary>
        /// 创建简单存储
        /// </summary>
        public override StoreBase<T> Create<T>(StoreShape shape)
        {
            return new EFStore<T>();
        }
    }
}

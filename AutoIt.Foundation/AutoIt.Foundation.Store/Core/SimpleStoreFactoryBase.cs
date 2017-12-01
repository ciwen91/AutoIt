namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 简单存储工厂基类
    /// </summary>
    public abstract class SimpleStoreFactoryBase
    {
        /// <summary>
        /// 存储类型
        /// </summary>
        public abstract StoreType StoreType { get; }
        /// <summary>
        /// 根据存储结构创建简单存储
        /// </summary>
        public abstract StoreBase<T> Create<T>(StoreShape shape) where T : EntityBase;
    }
}
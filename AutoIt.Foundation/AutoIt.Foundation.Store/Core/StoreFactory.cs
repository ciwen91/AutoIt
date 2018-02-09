using System;
using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Common;
using AutoIt.Foundation.Common.ClassHelper;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 存储工厂
    /// </summary>
    public class StoreFactory
    {
        /// <summary>
        /// 默认存储工厂
        /// </summary>
        public static StoreFactory Instance=new StoreFactory();
        /// <summary>
        /// 简单存储工厂集合
        /// </summary>
        private IEnumerable<SimpleStoreFactoryBase> _FactoryGroup =
            AssemblyHelper.GetAllRealizeInstance<SimpleStoreFactoryBase>();

        /// <summary>
        /// 存储对象缓存字典
        /// </summary>
        private Dictionary<Type, object> _StoreDic = new Dictionary<Type, object>();
        /// <summary>
        /// 存储配置字典
        /// </summary>
        private Dictionary<Type, StoreConfig> _StoreConfigDic = new Dictionary<Type, StoreConfig>();

        private StoreFactory()
        {
            
        }

        #region Get

        /// <summary>
        /// 获取存储(如果不存在则返回默认存储)
        /// </summary>
        public StoreBase<T> GetStore<T>() where T : EntityBase
        {
            var store = (StoreBase<T>)_StoreDic.GetOrSet(typeof(T), () => Create<T>());

            return store;
        }

        #endregion

        #region Config

        /// <summary>
        /// 设置存储配置
        /// </summary>
        public StoreFactory SetConfig(StoreConfig config)
        {
            //设置Config
            _StoreConfigDic[config.DataType] = config;
            //移除存储缓存(下次获取时会再创建)
            _StoreDic.Remove(config.DataType);

            return this;
        }

        /// <summary>
        /// 获取默认存储配置
        /// </summary>
        private StoreConfig GetDftConfig(Type dataType)
        {
            //默认为存储在数据库
            var config = new StoreConfig(dataType, StoreShape.Dic, new List<StoreConfigItem>()
            {
                new StoreConfigItem(StoreType.DBStore)
            });

            return config;
        }

        #endregion

        #region Create

        /// <summary>
        /// 创建存储
        /// </summary>
        private StoreBase<T> Create<T>() where T : EntityBase
        {
            var config = _StoreConfigDic.Get(typeof(T)) ?? GetDftConfig(typeof(T));

            //创建简单Store集合
            var group = config.Group.Select(item =>
            {
                var store = CreateSimple<T>(item.Type, config.Shape, item);
                store.IsLoadAll = config.IsLoadAll;

                return store;
            })
                .ToList();

            //将Store集合链接起来
            group.EachWithPre((item, pre) =>
            {
                pre.NextMedia = item;
            });

            //返回首个Store
            return group.First();
        }

        /// <summary>
        /// 创建简单存储
        /// </summary>
        private StoreBase<T> CreateSimple<T>(StoreType type, StoreShape shape, StoreConfigItem configItem)
            where T : EntityBase
        {
            //创建Store对象
            var factory = _FactoryGroup.First(item => item.StoreType == type);
            var store = factory.Create<T>(shape);

            //从Config里读取属性
            store.AbsluteExpires = configItem.AbsluteExpires;
            store.SlideExpires = configItem.SlideExpires;
            store.MaxBufferTime = configItem.MaxBufferTime;
            store.MaxBufferCount = configItem.MaxBufferCount;

            return store;
        }

        #endregion
    }
}

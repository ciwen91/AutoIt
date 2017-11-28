using System;
using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Common;
using AutoIt.Foundation.Common.ClassHelper;

namespace AutoIt.Foundation.Store
{
    public class StoreFactory
    {
        public static StoreFactory Default=new StoreFactory();

        public IEnumerable<SimpleStoreFactoryBase> FactoryGroup = AssemblyHelper.GetRealizeInstanceGroup<SimpleStoreFactoryBase>();
        private Dictionary<Type, object> _StoreDic = new Dictionary<Type, object>();

        private StoreFactory()
        {
            
        }

        #region Get

        public StoreBase<T> GetStore<T>() where T : EntityBase
        {
            var store = (StoreBase<T>)_StoreDic.GetOrSet(typeof(T), () => GetDftConfig(typeof(T)));

            return store;
        }

        #endregion

        #region Config

        public StoreFactory SetConfig(StoreConfig config)
        {
            var store = typeof(StoreFactory)
                .GetMethod(nameof(Create))
                .MakeGenericMethod(config.DataType)
                .Invoke(this, new object[] { config });

            _StoreDic[config.DataType] = store;

            return this;
        }

        private StoreConfig GetDftConfig(Type dataType)
        {
            //默认为存储在数据库的键值对类型
            var config = new StoreConfig(dataType, StoreShape.KeyValue, new List<StoreConfigItem>()
            {
                new StoreConfigItem(StoreType.DBStore)
            });

            return config;
        }

        #endregion

        #region Create

        public StoreBase<T> Create<T>(StoreConfig config) where T : EntityBase
        {
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

        private StoreBase<T> CreateSimple<T>(StoreType type, StoreShape shape, StoreConfigItem configItem)
            where T : EntityBase
        {
            //创建Store对象
            var factory = FactoryGroup.First(item => item.StoreType == type);
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

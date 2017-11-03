using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.StoreCenter.Core;

namespace StoreCenter
{
    public abstract class StoreCenter
    {
        private static Dictionary<Type, object> _StoreDic = new Dictionary<Type, object>();

        public static StoreBase<T> GetStore<T>() where T : EntityBase
        {
            if (!_StoreDic.ContainsKey(typeof(T)))
            {
                var dftConfig = GetDftConfig(typeof(T));
                var factory = new StoreFactory();
                var dftStore = factory.Create2(dftConfig);
                _StoreDic.Add(dftConfig.DataType, dftStore);
            }

            var store = _StoreDic[typeof(T)];

            return (StoreBase<T>)store;
        }

        public static void SetConfig(StoreConfig config)
        {
            var factory = new StoreFactory();

            var store = factory.Create2(config);
            _StoreDic[config.DataType] = store;
        }

        private static StoreConfig GetDftConfig(Type dataType)
        {
            var config = new StoreConfig()
            {
                DataType = dataType,

                Shape = StoreShape.KeyValue,
                Group = new List<StoreConfigItem>()
                {
                    new StoreConfigItem()
                    {
                        Type = StoreType.DBStore,
                        AbsluteExpires = 30*60
                    }
                }
            };

            return config;
        }
    }
}


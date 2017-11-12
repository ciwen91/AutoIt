using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using AutoIt.Foundation.Common;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 在StackExchange.Redis中最重要的对象是ConnectionMultiplexer类， 它存在于StackExchange.Redis命名空间中。
    /// 这个类隐藏了Redis服务的操作细节，ConnectionMultiplexer类做了很多东西， 在所有调用之间它被设计为共享和重用的。
    /// 不应该为每一个操作都创建一个ConnectionMultiplexer 。
    /// </summary>
    public class RedisRepository
    {
        public  static DependcyData<string> ConStr = new DependcyData<string>();

        protected static object _Locker = new object();
        protected static  Dictionary<string, ConnectionMultiplexer> _ConnectorInstance = new Dictionary<string, ConnectionMultiplexer>();       

        private ConnectionMultiplexer _Connecter;
        private IDatabase _Db;

        public RedisRepository()
        {
            var conStr=ConStr.GetData();

            if (!_ConnectorInstance.ContainsKey(conStr))
            {
                lock (_Locker)
                {
                    if (!_ConnectorInstance.ContainsKey(conStr))
                    {
                        var connector = ConnectionMultiplexer.Connect(conStr);
                        _ConnectorInstance.Add(conStr, connector);
                    }
                }
            }

            /*
             * !_ConnectorInstance.IsConnected
             */

            this._Connecter = _ConnectorInstance[conStr];
            this._Db = _Connecter.GetDatabase();
        }

        #region String
        public T Get<T>(string key)
        {
            var value = _Db.StringGet(key);
            var entity = GetEntity<T>(value);

            return entity;
        }
        public IEnumerable<T> GetGroup<T>(IEnumerable<string> keyGroup)
        {
            var redisValGroup = _Db.StringGet(keyGroup.Select(item => (RedisKey)item).ToArray());

            return redisValGroup.Select(GetEntity<T>)
                .ToList();
        }
        public RedisRepository Set<T>(string key, T value, TimeSpan? expiry = null)
        {
            var strValue = JsonConvert.SerializeObject(value);
            _Db.StringSet(key, strValue, expiry);

            return this;
        }
        public RedisRepository SetGroup<T>(Dictionary<string, T> dic, TimeSpan? expiry = null)
        {
            var redisKeyValGroup =
                dic.Select(
                        item =>
                                new KeyValuePair<RedisKey, RedisValue>(item.Key, JsonConvert.SerializeObject(item.Value)))
                    .ToArray();

            _Db.StringSet(redisKeyValGroup);

            //TODO:应用管道提高性能
            if (expiry != null)
            {
                foreach (var item in dic.Keys)
                {
                    SetExpiry(item, expiry);
                }
            }
            return this;
        }
        public RedisRepository Remove(string key)
        {
            _Db.KeyDelete(key);

            return this;
        }
        public RedisRepository RemoveGroup(IEnumerable<string> keyGroup)
        {
            _Db.KeyDelete(keyGroup.Select(item => (RedisKey)item).ToArray());

            return this;
        }
        public bool Exist(string key)
        {
            return _Db.KeyExists(key);
        }
        public IEnumerable<string> ExistGroup(IEnumerable<string> keyGroup)
        {
            ///ToDO：应使用管道
            var existsKeyGroup = keyGroup.Where(Exist).ToList();

            return existsKeyGroup;
        }
        public RedisRepository SetExpiry(string key, TimeSpan? timeSpan)
        {
            _Db.KeyExpire(key, timeSpan);
            return this;
        }

        public RedisRepository SetExpiry(IEnumerable<string> keyGroup, TimeSpan? timeSpan)
        {
            foreach (var item in keyGroup)
            {
                SetExpiry(item, timeSpan);
            }

            return this;
        }
        #endregion

        #region Hash
        public Dictionary<string, T> GetAll<T>(string key)
        {
            var group = _Db.HashGetAll(key)
                .ToDictionary(item => item.Name.ToString(), item => GetEntity<T>(item.Value));
            return group;
        }
        public T GetItem<T>(string key, string itemKey)
        {
            var val = _Db.HashGet(key, itemKey);

            return GetEntity<T>(val);
        }
        public IEnumerable<T> GetItemGroup<T>(string key, IEnumerable<string> itemKeyGroup)
        {
            //支持排除返回dic而不是value list(管道)
            //var valueGroup = _Db.hash(key, GetValueGroup(itemKeyGroup));
            //var entityGroup = valueGroup.Select(item=>item.).SetValue(item => GetValue<T>(item))
            //    .ToList();
            ///ToDO:由于
            //var dic = itemKeyGroup
            //    .ToDictionary(item => item, item => GetItem<T>(key, item));
            //return dic;

            var valueGroup = _Db.HashGet(key, itemKeyGroup.Select(item => (RedisValue) item).ToArray())
                .Select(GetEntity<T>)
                .ToList();

            return valueGroup;
        }
        public RedisRepository SetItem<T>(string key, string itemKey, T value)
        {
            var strValue = JsonConvert.SerializeObject(value);
            _Db.HashSet(key, itemKey, strValue);

            return this;
        }
        public RedisRepository SetItemGroup<T>(string key, Dictionary<string, T> itemDic)
        {
            var fieldGroup = itemDic.Select(item => new HashEntry(item.Key, JsonConvert.SerializeObject(item.Value)))
                .ToArray();
            _Db.HashSet(key, fieldGroup);

            return this;
        }
        public RedisRepository RemoveItem(string key, string itemKey)
        {
            _Db.HashDelete(key, itemKey);

            return this;
        }
        public RedisRepository RemoveItemGroup(string key, IEnumerable<string> itemKeyGroup)
        {
            _Db.HashDelete(key, itemKeyGroup.Select(item=>(RedisValue)item).ToArray());

            return this;
        }
        public bool ExistItem(string key, string itemKey)
        {
            return _Db.HashExists(key, itemKey);
        }
        public IEnumerable<string> ExistItemGroup(string key,IEnumerable<string> keyGroup)
        {
            var existsKeyGroup = keyGroup.Where(item => ExistItem(key, item)).ToList();
            return existsKeyGroup;
        }
        public int CountItem(string key)
        {
            return (int)_Db.HashLength(key);
        }
        #endregion

        #region 发布、订阅
        public long Publish(string channel, string message)
        {
            var sub = _Connecter.GetSubscriber();
            return sub.Publish(channel, message);
        }

        public  void Subscribe(string channel, Action<string> action)
        {
            ISubscriber sub = _Connecter.GetSubscriber();
            sub.Subscribe(channel, (sChannel, message) =>
            {
                action(message);
            });
        }
        #endregion

        #region Server Oper
        public RedisRepository FlushAll()
        {
           _Connecter.GetServer(_Connecter.GetEndPoints()[0]).FlushAllDatabases();
            return this;
        }
        #endregion

        #region Common
        protected T GetEntity<T>(RedisValue value)
        {
            return value.IsNull ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
        #endregion
    }
}
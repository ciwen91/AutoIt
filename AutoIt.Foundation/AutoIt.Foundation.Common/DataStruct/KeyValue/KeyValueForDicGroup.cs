using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Common
{
    public class KeyValueForDicGroup<TKey,TValue>:IKeyValue<TKey,TValue>
    {
        private IEnumerable<Dictionary<TKey, TValue>> _Group;

        public KeyValueForDicGroup(IEnumerable<Dictionary<TKey,TValue>> group)
        {
            this._Group = group;
        }

        public bool Exsite(TKey key)
        {
            return GetAll().Any(item => item.Key.Equals(key)); 
        }

        public TValue Get(TKey key)
        {
            return GetAll().FirstOrDefault(item => item.Key.Equals(key)).Value;
        }

        public IEnumerable<KeyValuePair<TKey, TValue>> GetAll()
        {
            var group = new List<TKey>();

            foreach (var item in _Group.SelectMany(item => item))
            {
                if (!group.Contains(item.Key))
                {
                    group.Add(item.Key);
                    yield return item;
                }
            }
        }

        public IKeyValue<TKey, TValue> Set(TKey key, TValue value)
        {
            _Group.First()[key] = value;
            return this;
        }

        public IKeyValue<TKey, TValue> Remove(TKey key)
        {
            _Group.First().Remove(key);
            return this;
        }
    }
}
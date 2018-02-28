using System.Collections.Generic;

namespace AutoIt.Foundation.Common
{
    public interface IKeyValue<TKey, TValue>
    {
        bool Exsite(TKey key);
        TValue Get(TKey key);
        IEnumerable<KeyValuePair<TKey, TValue>> GetAll(); 
        IKeyValue<TKey, TValue> Set(TKey key,TValue value);
        IKeyValue<TKey, TValue> Remove(TKey key);
    }
}
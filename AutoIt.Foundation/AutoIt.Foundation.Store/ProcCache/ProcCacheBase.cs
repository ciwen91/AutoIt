using System;
using System.Collections.Generic;
using System.Runtime.Caching;

namespace StoreCenter
{
    public abstract class ProcCacheBase<T> : StoreBase<T> where T : EntityBase
    {
        protected MemoryCache _Repository = MemoryCache.Default;

        protected override void AddInner(IEnumerable<T> @group)
        {
             Update(group);
        }

        protected TValue GetValue<TValue>(string key)
        {
            return _Repository.Contains(key) ? (TValue)_Repository[key] : default(TValue);
        }

        protected CacheItemPolicy GetCachePolicy()
        {
            var cachePolicy = new CacheItemPolicy();

            if (AbsluteExpires != null)
            {
                cachePolicy.AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(AbsluteExpires.Value);
            }

            if (SlideExpires != null)
            {
                cachePolicy.SlidingExpiration = TimeSpan.FromSeconds(SlideExpires.Value);
            }

            return cachePolicy;
        }
    }
}
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

            if (ExpireInfo.AbsluteExpires != null)
            {
                cachePolicy.AbsoluteExpiration = DateTimeOffset.Now.AddSeconds(ExpireInfo.AbsluteExpires.Value);
            }

            if (ExpireInfo.SlideExpires != null)
            {
                cachePolicy.SlidingExpiration = TimeSpan.FromSeconds(ExpireInfo.SlideExpires.Value);
            }

            return cachePolicy;
        }
    }
}
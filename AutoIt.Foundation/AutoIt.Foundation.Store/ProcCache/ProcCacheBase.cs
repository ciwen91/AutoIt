using System;
using System.Collections.Generic;
using System.Runtime.Caching;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 进程内缓存基类
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class ProcCacheBase<T> : StoreBase<T> where T : EntityBase
    {
        protected MemoryCache _Repository = MemoryCache.Default;

        /// <summary>
        /// Add方法和Update方法一致
        /// </summary>
        protected override void AddInner(IEnumerable<T> @group)
        {
             UpdateInner(group);
        }
       
        /// <summary>
        /// 获取缓存策略
        /// </summary>
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
using System;
using System.Collections.Generic;

namespace AutoIt.Foundation.Store
{
    public abstract class RedisCacheBase<T> : StoreBase<T> where T : EntityBase
    {
        protected RedisRepository _Repository = new RedisRepository();

        protected override void AddInner(IEnumerable<T> @group)
        {
            UpdateInner(group);
        }

        protected TimeSpan? GetExpireTimeSpan()
        {
            //Redis不原生支持滑动过期时间
            var expire = AbsluteExpires??SlideExpires;

            return expire == null ? (TimeSpan?) null : TimeSpan.FromSeconds(expire.Value);
        }
    }
}
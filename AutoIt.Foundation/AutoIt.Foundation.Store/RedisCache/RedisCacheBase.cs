using System;
using System.Collections.Generic;

namespace StoreCenter
{
    public abstract class RedisCacheBase<T> : StoreBase<T> where T : EntityBase
    {
        protected RedisRepository _Repository = new RedisRepository();

        protected override void AddInner(IEnumerable<T> @group)
        {
            Update(group);
        }

        protected TimeSpan? GetExpireTimeSpan()
        {
            var expire = ExpireInfo.Expires;

            return expire == null ? (TimeSpan?) null : TimeSpan.FromSeconds(expire.Value);
        }
    }
}
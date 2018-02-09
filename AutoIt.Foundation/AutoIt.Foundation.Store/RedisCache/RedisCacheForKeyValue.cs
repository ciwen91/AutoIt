using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Store
{
    public class RedisCacheForKeyValue<T> : RedisCacheBase<T> where T : EntityBase
    {
        #region IDataMedia
   
        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            return _Repository.GetGroup<T>(keyGroup);
        }
        protected override void UpdateInner(IEnumerable<T> group)
        {
            var expireSpan = GetExpireTimeSpan();

            _Repository.SetGroup(group.ToDictionary(GetStoreKey), expireSpan);
        }
        protected override void DeleteInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            _Repository.RemoveGroup(keyGroup);
        }

        protected override IEnumerable<T> GetAllInner()
        {
            throw new NotSupportedException($"{nameof(RedisCacheForKeyValue<T>)}不支持{nameof(GetAllInner)}方法");
        }

        protected override void DeleteAllInner()
        {
            throw new NotSupportedException($"{nameof(RedisCacheForKeyValue<T>)}不支持{nameof(DeleteAllInner)}方法");
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            return _Repository.ExistGroup(keyGroup);
        }
        protected override int CountInner()
        {
            throw new NotSupportedException($"{nameof(RedisCacheForKeyValue<T>)}不支持{nameof(CountInner)}方法");
        }

        #endregion

        #region Aop

        public override void BeforeGet(IEnumerable<string> keyGroup)
        {
            base.BeforeGet(keyGroup);

            //重新设置滑动过期时间
            if (SlideExpires != null&&keyGroup!=null)
            {
                keyGroup = keyGroup.Select(GetStoreKey);
                _Repository.SetExpiry(keyGroup, TimeSpan.FromSeconds(SlideExpires.Value));
            }
        }

        #endregion
    }
}
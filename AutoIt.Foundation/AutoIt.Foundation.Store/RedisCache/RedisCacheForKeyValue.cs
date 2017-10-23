using System;
using System.Collections.Generic;
using System.Linq;
using StoreCenter.Core;

namespace StoreCenter
{
    public class RedisCacheForKeyValue<T> : RedisCacheBase<T> where T : EntityBase
    {
        #region IDataMedia

        protected override IEnumerable<T> GetInner()
        {
            return null;
        }

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            return _Repository.GetGroup<T>(keyGroup);
        }


        protected override void UpdateInner(IEnumerable<T> group)
        {
            var expireSpan = GetExpireTimeSpan();

            _Repository.SetGroup(group.ToDictionary(item => GetStoreKey(item.Key_)), expireSpan);
        }

        protected override void DeleteInner(IEnumerable<string> keyGroup)
        {
            _Repository.RemoveGroup(keyGroup);
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            return _Repository.ExistGroup(keyGroup);
        }

        protected override int CountInner()
        {
            return -1;
        }

        #endregion

        #region Aop

        public override void BeforeGet(IEnumerable<string> keyGroup)
        {
            base.BeforeGet(keyGroup);

            if (ExpireInfo.SlideExpires != null)
            {
                _Repository.SetExpiry(keyGroup, TimeSpan.FromSeconds(ExpireInfo.SlideExpires.Value));
            }
        }

        #endregion
    }
}
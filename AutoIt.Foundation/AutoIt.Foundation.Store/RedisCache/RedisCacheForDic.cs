using System;
using System.Collections.Generic;
using System.Linq;
using StoreCenter.Core;

namespace StoreCenter
{
    public class RedisCacheForDic<T> :RedisCacheBase<T> where T : EntityBase
    {
        #region IDataMedia

        protected override IEnumerable<T> GetInner()
        {
            return _Repository.GetAll<T>(StoreKey).Values;
        }

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            return _Repository.GetItemGroup<T>(StoreKey, keyGroup).Values;
        }

        protected override void UpdateInner(IEnumerable<T> @group)
        {
            var timeSpan = GetExpireTimeSpan();

            _Repository.SetItemGroup(StoreKey, group.ToDictionary(item => item.Key_));

            if (timeSpan != null)
            {
                _Repository.SetExpiry(StoreKey, timeSpan);
            }
        }

        protected override void DeleteInner(IEnumerable<string> @group)
        {
            _Repository.RemoveItemGroup(StoreKey, group);
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            return _Repository.ExistItemGroup(StoreKey, keyGroup);
        }

        protected override int CountInner()
        {
            return _Repository.CountItem(StoreKey);
        }

        #endregion

        #region AOP

        protected void BeforeGet()
        {
            var slide = ExpireInfo.SlideExpires;

            if (slide != null)
            {
                _Repository.SetExpiry(StoreKey, TimeSpan.FromSeconds(slide.Value));
            }
        }

        #endregion
    }
}
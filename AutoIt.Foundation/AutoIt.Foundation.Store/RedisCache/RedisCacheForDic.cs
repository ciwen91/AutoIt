using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Store
{
    public class RedisCacheForDic<T> :RedisCacheBase<T> where T : EntityBase
    {
        #region IDataMedia
        
        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            return _Repository.GetItemGroup<T>(StoreKey, keyGroup);
        }
        protected override void UpdateInner(IEnumerable<T> @group)
        {
            _Repository.SetItemGroup(StoreKey, group.ToDictionary(item => item.Key_));

            //设置过期时间(更新时重置过期时间)
            var timeSpan = GetExpireTimeSpan();

            if (timeSpan != null)
            {
                _Repository.SetExpiry(StoreKey, timeSpan);
            }
        }
        protected override void DeleteInner(IEnumerable<string> @group)
        {
            _Repository.RemoveItemGroup(StoreKey, group);
        }

        protected override IEnumerable<T> GetInner()
        {
            return _Repository.Exist(StoreKey) ? _Repository.GetAll<T>(StoreKey).Values : null;
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            return _Repository.ExistItemGroup(StoreKey, keyGroup);
        }
        protected override int CountInner()
        {
            return _Repository.Exist(StoreKey) ? _Repository.CountItem(StoreKey) : -1;
        }

        #endregion

        #region AOP

        public override void BeforeGet(IEnumerable<string> keyGroup)
        {
            var slide = SlideExpires;

            //重新设置滑动过期时间
            if (slide != null)
            {
                _Repository.SetExpiry(StoreKey, TimeSpan.FromSeconds(slide.Value));
            }
        }

        #endregion
    }
}
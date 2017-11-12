﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace AutoIt.Foundation.Store
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
            keyGroup = keyGroup.Select(GetStoreKey);

            return _Repository.GetGroup<T>(keyGroup);
        }


        protected override void UpdateInner(IEnumerable<T> group)
        {
            var expireSpan = GetExpireTimeSpan();

            _Repository.SetGroup(group.ToDictionary(item => GetStoreKey(item.Key_)), expireSpan);
        }

        protected override void DeleteInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            _Repository.RemoveGroup(keyGroup);
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

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

            if (SlideExpires != null)
            {
                keyGroup = keyGroup.Select(GetStoreKey);
                _Repository.SetExpiry(keyGroup, TimeSpan.FromSeconds(SlideExpires.Value));
            }
        }

        #endregion
    }
}
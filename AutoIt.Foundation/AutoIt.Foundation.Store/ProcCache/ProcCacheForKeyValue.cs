using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;

namespace AutoIt.Foundation.Store
{
    public class ProcCacheForKeyValue<T> : ProcCacheBase<T> where T : EntityBase
    {
        #region IDataMedia

        protected override IEnumerable<T> GetInner()
        {
            return null;
        }

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            var group = keyGroup.Select(GetValue<T>)
                    .Where(item => item != null)
                    .ToList();

            return group;
        }

        protected override void UpdateInner(IEnumerable<T> @group)
        {
            foreach (var item in group)
            {
                var policy = GetCachePolicy();
                var key = GetStoreKey(item);

                _Repository.Set(key, item, policy);
            }
        }

        protected override void DeleteInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            foreach (var item in keyGroup)
            {
                _Repository.Remove(item);
            }
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            keyGroup = keyGroup.Select(GetStoreKey);

            var result = keyGroup.Where(item => _Repository.Contains(item))
                  .ToList();

            return result;
        }

        protected override int CountInner()
        {
            return -1;
        }

        #endregion
    }
}
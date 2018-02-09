using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using AutoIt.Foundation.Common;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Store
{
    public class ProcCacheForKeyValue<T> : ProcCacheBase<T> where T : EntityBase
    {
        #region IDataMedia

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            var group = new List<T>();

            foreach (var item in keyGroup)
            {
                if (_Repository.Contains(item))
                {
                    group.Add((T) _Repository.Get(item));
                }
            }

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

        protected override IEnumerable<T> GetAllInner()
        {
            throw new NotSupportedException($"{nameof(ProcCacheForKeyValue<T>)}不支持{nameof(GetAllInner)}方法");
        }
        protected override void DeleteAllInner()
        {
            throw new NotSupportedException($"{nameof(ProcCacheForKeyValue<T>)}不支持{nameof(DeleteAllInner)}");
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
            throw new NotSupportedException($"{nameof(ProcCacheForKeyValue<T>)}不支持{nameof(CountInner)}");
        }

        #endregion
    }
}
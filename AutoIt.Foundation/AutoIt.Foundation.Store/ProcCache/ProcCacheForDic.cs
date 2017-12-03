using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Common;
using AutoIt.Foundation.Common.ClassHelper;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Store
{
    public class ProcCacheForDic<T> : ProcCacheBase<T> where T : EntityBase
    {
        #region IDataMedia

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            var dic = _Dic;

            if (_Dic == null)
            {
                return new List<T>();
            }
            else
            {
                var group = keyGroup.Select(item => dic.Get(item))
                    .Where(item => item != null)
                    .ToList();

                return group;
            }
        }
        protected override void UpdateInner(IEnumerable<T> group)
        {
            var dic = _Dic;

            if (_Dic == null)
            {
                dic = new Dictionary<string, T>();
                var policy = GetCachePolicy();

                _Repository.Set(StoreKey, dic, policy);
            }

            foreach (var item in group)
            {
                dic[item.Key_] = item;
            }
        }
        protected override void DeleteInner(IEnumerable<string> group)
        {
            var dic = _Dic;

            if (dic != null)
            {
                foreach (var item in group)
                {
                    dic.Remove(item);
                }
            }
        }

        protected override IEnumerable<T> GetInner()
        {
            return _Dic?.Values;
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            var dic = _Dic;

            if (dic == null)
            {
                return new List<string>();
            }
            else
            {
                var result = keyGroup.Where(dic.ContainsKey).ToList();

                return result;
            }
        }
        protected override int CountInner()
        {
            var dic = _Dic;

            return dic?.Count ?? -1;
        }

        #endregion

        protected Dictionary<string, T> _Dic => GetValue<Dictionary<string, T>>(StoreKey);
    }
}
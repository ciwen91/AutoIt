

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Text;
using AutoIt.Foundation.Common;
using EntityFramework.Extensions;

namespace AutoIt.Foundation.Store
{
    public class EFStore<T>: StoreBase<T>,IQueryableDataStore<T> where T : EntityBase
    {
        protected EFRepository _Repository=new EFRepository();

        #region IDataMedia<T>

        protected override IEnumerable<T> GetInner()
        {
            using (var context=_Repository.NewContext)
            {
                var group = context.Set<T>().ToList();
                return group;
            }
        }

        protected override IEnumerable<T> GetInner(IEnumerable<string> keyGroup)
        {
            var whereStr = GetWhereStr(keyGroup);

            using (var context = _Repository.NewContext)
            {
                var group = context.Set<T>()
                    .Where(whereStr)
                    .ToList();
                return group;
            }
        }

        protected override void AddInner(IEnumerable<T> group)
        {
            using (var context = _Repository.NewContext)
            {
                ///Todo:Bulk Add
                context.Set<T>().AddRange(group);
                context.SaveChanges();
            }
        }

        protected override void UpdateInner(IEnumerable<T> @group)
        {
            using (var context = _Repository.NewContext)
            {
                foreach (var item in group)
                {
                    context.Entry(item).State = EntityState.Modified;
                }

                context.SaveChanges();
            }
        }

        protected override void DeleteInner(IEnumerable<string> keyGroup)
        {
            var whereStr = GetWhereStr(keyGroup);

            using (var context = _Repository.NewContext)
            {
                context.Set<T>()
                    .Where(whereStr)
                    .Delete();
            }
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            var whereStr = GetWhereStr(keyGroup);
            var selectStr = GetSelectStr();

            using (var context = _Repository.NewContext)
            {
                var group = ((IQueryable<string>) context.Set<T>()
                        .Where(whereStr)
                        .Select(selectStr))
                    .ToList();

                return group;
            }
        }

        protected override int CountInner()
        {
            using (var context = _Repository.NewContext)
            {
                var count = context.Set<T>().Count();
                return count;
            }
        }

        #endregion

        #region IQueryable<T>

        public IEnumerable<T> Query(string @where=null, string order = null)
        {
            using (var context=_Repository.NewContext)
            {
                var group =(IQueryable<T>) context.Set<T>();

                if (!string.IsNullOrEmpty(where))
                {
                   group=group.Where(where);
                }

                if (!string.IsNullOrEmpty(order))
                {
                    group = group.OrderBy(order);
                }

                return group.ToList();
            }
        }

        public IEnumerable<T> Query(int pageNum, int pageSize, string @where, string order = null)
        {
            using (var context = _Repository.NewContext)
            {
                var group = (IQueryable<T>)context.Set<T>();

                if (!string.IsNullOrEmpty(where))
                {
                    group = group.Where(where);
                }

                if (!string.IsNullOrEmpty(order))
                {
                    group = group.OrderBy(order);
                }

                group = group.Skip((pageNum - 1)*pageSize).Take(pageSize);
           
                return group.ToList();
            }
        }

        public void Update(Expression<Func<T, bool>> whereExpress,Expression<Func<T,T>> updateExpress)
        {
            using (var context = _Repository.NewContext)
            {
                context.Set<T>()
                    .Where(whereExpress)
                    .Update(updateExpress);
            }
        }

        public void Delete(Expression<Func<T, bool>> whereExpress)
        {
            using (var context = _Repository.NewContext)
            {
                context.Set<T>()
                    .Where(whereExpress)
                    .Delete();
            }
        }

        public IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress)
        {
            var selectStr = GetSelectStr();

            using (var context = _Repository.NewContext)
            {
                var group = ((IQueryable<string>) context.Set<T>()
                        .Where(whereExpress)
                        .Select(selectStr))
                    .ToList();

                return group;
            }
        }

        public int Count(Expression<Func<T, bool>> whereExpress)
        {
            using (var context=_Repository.NewContext)
            {
                var count = context.Set<T>()
                .Where(whereExpress)
                .Count();

                return count;
            }
        }

        #endregion

        #region Dynamic 

        public string GetSelectStr()
        {
            var keyNameGroup = EntityBase.GetKeyNameGroup(typeof(T));

            var selectStr = keyNameGroup.JoinStr("+ '$' +");
            selectStr =selectStr+ ".ToString()";

            return selectStr;
        }

        public string GetWhereStr(IEnumerable<string> keyGroup)
        {
            var group = keyGroup.Select(GetWhereStr)
                .ToList();

            if (group.Count > 1)
            {
                group = group.Select(item => $"({item})")
                    .ToList();
            }

            var whereStr = group.JoinStr("OR");

            return whereStr;
        }

        public string GetWhereStr(string key)
        {
            var whereStr = EntityBase.GetKeyNameValueDic(typeof(T), key)
                .Select(item => $"{item.Key}={item.Value}")//??? \"
                .JoinStr(" AND ");

            return whereStr;
        }

        #endregion

        #region Others
        public void Truncate()
        {
            using (var context=_Repository.NewContext)
            {
                context.Database.ExecuteSqlCommand($"Truncate Table {typeof(T).Name}");
            }
        }

        #endregion
    }
}

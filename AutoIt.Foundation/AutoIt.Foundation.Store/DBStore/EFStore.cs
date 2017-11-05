

using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
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
            using (var context = _Repository.NewContext)
            {
                var group = context.Set<T>()
                    .Where(item => keyGroup.Contains(item.Key_))
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
            using (var context = _Repository.NewContext)
            {
                context.Set<T>()
                    .Where(item => keyGroup.Contains(item.Key_))
                    .Delete();
            }
        }

        protected override IEnumerable<string> ExistInner(IEnumerable<string> keyGroup)
        {
            using (var context = _Repository.NewContext)
            {
                var group = context.Set<T>()
                    .Where(item => keyGroup.Contains(item.Key_))
                    .Select(item => item.Key_)
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

        public IQueryable<T> Set
        {
            get { return _Repository.NewContext.Set<T>(); }
        }

        public IEnumerable<T> Get(IQueryable<T> query ,string where, string order = null)
        {
            if (!string.IsNullOrEmpty(where))
            {
                query = query.Where(where);
            }

            if (!string.IsNullOrEmpty(order))
            {
                query = query.OrderBy(order);
            }

            return query.ToList();
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
            using (var context = _Repository.NewContext)
            {
                var group = context.Set<T>()
                    .Where(whereExpress)
                    .Select(item => item.Key_)
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
    }
}

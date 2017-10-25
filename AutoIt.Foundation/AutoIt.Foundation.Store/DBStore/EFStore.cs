using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Linq.Dynamic;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using EntityFramework.Extensions;
using StoreCenter;

namespace AutoIt.Foundation.StoreCenter.DBStore
{
    public class EFStore<T> : IQueryableDataStore<T> where T : EntityBase
    {
        protected DbContext _DbContext=new DbContext("");

        #region IDataMedia<T>

        public IEnumerable<T> Get()
        {
            var group = _DbContext.Set<T>().ToList();
            return group;
        }

        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            var group = _DbContext.Set<T>()
                .Where(item => keyGroup.Contains(item.Key_))
                .ToList();
            return group;
        }

        public void Add(IEnumerable<T> group)
        {
            ///Todo:Bulk Add
            _DbContext.Set<T>().AddRange(group);
            _DbContext.SaveChanges();
        }

        public void Update(IEnumerable<T> @group)
        {
            foreach (var item in group)
            {
                _DbContext.Entry(item).State = EntityState.Modified;
            }
            
            _DbContext.SaveChanges();
        }

        public void Delete(IEnumerable<string> keyGroup)
        {
            _DbContext.Set<T>()
                .Where(item => keyGroup.Contains(item.Key_))
                .Delete();
        }

        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            var group = _DbContext.Set<T>()
                .Where(item => keyGroup.Contains(item.Key_))
                .Select(item => item.Key_)
                .ToList();

            return group;
        }

        public int Count()
        {
            var count = _DbContext.Set<T>().Count();
            return count;
        }

        #endregion

        #region IQueryable<T>

        public IQueryable<T> Set
        {
            get { return _DbContext.Set<T>(); }
        }

        public IEnumerable<T> Get<T>(IQueryable<T> query ,string where, string order = null)
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
            _DbContext.Set<T>()
                .Where(whereExpress)
                .Update(updateExpress);
        }

        public void Delete(Expression<Func<T,bool>> whereExpress)
        {
            _DbContext.Set<T>()
                .Where(whereExpress)
                .Delete();
        }

        public IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress)
        {
            var group = _DbContext.Set<T>()
                .Where(whereExpress)
                .Select(item => item.Key_)
                .ToList();

            return group;
        }

        public int Count(Expression<Func<T, bool>> whereExpress)
        {
            var count= _DbContext.Set<T>()
                .Where(whereExpress)
                .Count();

            return count;
        }

        #endregion
    }
}

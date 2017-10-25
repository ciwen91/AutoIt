using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using StoreCenter;

namespace AutoIt.Foundation.StoreCenter.DBStore
{
    public class EFStore<T> : IQueryableDataMedia<T> where T : EntityBase
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
            foreach (var item in keyGroup)
            {
                var entity = Activator.CreateInstance<T>();
                entity.Key_ = item;

                _DbContext.Entry(entity).State = EntityState.Deleted;
            }

            _DbContext.SaveChanges();
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

        public IEnumerable<T> Get(IQueryable<T> query)
        {
            return query.ToList();
        }

        public void Update(IQueryable<T> query)
        {
            throw new NotImplementedException();
        }

        public void Delete(IQueryable<T> query)
        {
            throw new NotImplementedException();
        }

        public int Count(IQueryable<T> query)
        {
            return query.Count();
        }

        #endregion


    }
}

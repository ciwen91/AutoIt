using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace StoreCenter
{
    public interface IQueryableDataStore<T> : IDataStore<T> where T : EntityBase
    {
        IQueryable<T> Set { get; }
        IEnumerable<T> Get<T>(IQueryable<T> query, string where, string order = null);
        void Update(Expression<Func<T, bool>> whereExpress, Expression<Func<T, T>> updateExpress);
        void Delete(Expression<Func<T, bool>> whereExpress);
        IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress);
        int Count(Expression<Func<T, bool>> whereExpress);
    }
}
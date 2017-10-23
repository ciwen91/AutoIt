using System.Collections.Generic;
using System.Linq;

namespace StoreCenter
{
    public interface IQueryableDataMedia<T> : IDataMedia<T> where T : EntityBase
    {
        IEnumerable<T> Get(IQueryable<T> query);
        void Update(IQueryable<T> query);
        void Delete(IQueryable<T> query);
        int Count(IQueryable<T> query);
    }
}
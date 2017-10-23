using System.Collections.Generic;

namespace StoreCenter
{
    public interface IDataMedia<T> where T:EntityBase
    {
        IEnumerable<T> Get();
        IEnumerable<T> Get(IEnumerable<string> keyGroup);

        void Add(IEnumerable<T> group);
        void Update(IEnumerable<T> group);
        void Delete(IEnumerable<string> group);

        IEnumerable<string> Exist(IEnumerable<string> keyGroup);
        int Count();
    }
}
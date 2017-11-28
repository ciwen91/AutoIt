using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Store
{
    public class StoreCenter<T> : IQueryableDataStore<T> where T : EntityBase
    {
        private StoreBase<T> _Store = StoreFactory.Default.GetStore<T>();

        private IQueryableDataStore<T> _IQueryStore
        {
            get
            {
                StoreBase<T> store = _Store;

                while (store != null)
                {
                    var queryStore = store as IQueryableDataStore<T>;

                    if (queryStore != null)
                    {
                        return queryStore;
                    }

                    store = store.NextMedia;
                }

                throw new NotSupportedException($"{typeof(T)}没有支持IQueryableDataStore<{typeof(T)}>的存储容器!");
            }
        }

        #region IDataStore<T>

        public IEnumerable<T> Get()
        {
            return _Store.Get();
        }

        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            return _Store.Get(keyGroup);
        }

        public void Add(IEnumerable<T> @group)
        {
            _Store.Add(group);
        }

        public void Update(IEnumerable<T> @group)
        {
            _Store.Update(group);
        }

        public void Delete(IEnumerable<string> @group)
        {
            _Store.Delete(group);
        }

        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            return _Store.Exist(keyGroup);
        }

        public int Count()
        {
            return _Store.Count();
        }

        #endregion

        #region IQueryableDataStore<T>

        private IQueryableDataStore<T> QueryStore
        {
            get
            {
                StoreBase<T> store = _Store;

                while (store!=null)
                {
                    if (store is IQueryableDataStore<T>)
                    {
                        break;
                    }

                    store = store.NextMedia;
                }

                if (store == null)
                {
                    throw new Exception($"{typeof(T).FullName}没有配置IQueryableDataStore类型的容器！");
                }

                return (IQueryableDataStore<T>)store;
            }
        }

        public IEnumerable<T> Query(string @where=null, string order = null)
        {
            return QueryStore.Query(where, order);
        }

        public IEnumerable<T> Query( int pageNum, int pageSize, string @where=null, string order = null)
        {
            return QueryStore.Query(pageNum, pageSize, where, order);
        }

        public void Update(Expression<Func<T, bool>> whereExpress, Expression<Func<T, T>> updateExpress)
        {
            QueryStore.Update(whereExpress, updateExpress);
        }

        public void Delete(Expression<Func<T, bool>> whereExpress)
        {
            QueryStore.Delete(whereExpress);
        }

        public IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress)
        {
            return QueryStore.Exist(whereExpress);
        }

        public int Count(Expression<Func<T, bool>> whereExpress)
        {
            return QueryStore.Count(whereExpress);
        }

        #endregion

        #region ExtMethod For IDataStore<T>

        public T Get(string key)
        {
            ///ToDo:集合和单个实体的数据处理能不能统一?
            return Get(new List<string> {key}).FirstOrDefault();
        }

        public void Add(T entity)
        {
            Add(new List<T> {entity});
        }

        public void Update(T entity)
        {
            Update(new List<T> {entity});
        }

        public void Delete(string key)
        {
            Delete(new List<string> {key});
        }

        public bool Exist(string key)
        {
            var group = Exist(new List<string>() {key});

            return group.Any();
        }

        #endregion

        #region Others

        public void Delete(IEnumerable<T> group)
        {
            Delete(group.Select(item => item.Key_));
        }

        public void Delete(T entity)
        {
            Delete(new List<T>() { entity });
        }

        #endregion
    }
}

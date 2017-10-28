﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace StoreCenter
{
    public class StoreCenter<T> : StoreCenter, IQueryableDataStore<T> where T : EntityBase
    {
        private StoreBase<T> _Store = StoreCenter.GetStore<T>();

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

        public IQueryable<T> Set
        {
            get { return _IQueryStore.Set; }
        }

        public IEnumerable<T> Get(IQueryable<T> query, string @where, string order = null)
        {
            var store = _IQueryStore;

            return store.Get(query, where, order);
        }

        public void Update(Expression<Func<T, bool>> whereExpress, Expression<Func<T, T>> updateExpress)
        {
            var store = _IQueryStore;

            store.Update(whereExpress, updateExpress);
        }

        public void Delete(Expression<Func<T, bool>> whereExpress)
        {
            var store = _IQueryStore;

            store.Delete(whereExpress);
        }

        public IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress)
        {
            var store = _IQueryStore;

            return store.Exist(whereExpress);
        }

        public int Count(Expression<Func<T, bool>> whereExpress)
        {
            var store = _IQueryStore;

            return store.Count(whereExpress);
        }

        #endregion
    }
}

using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 存储中心
    /// </summary>
    public class StoreCenter<T> : IQueryableDataStore<T> where T : EntityBase
    {
        /// <summary>
        /// 存储对象
        /// </summary>
        private StoreBase<T> _Store = StoreFactory.Instance.GetStore<T>();
        /// <summary>
        /// 可查询的存储对象
        /// </summary>
        private IQueryableDataStore<T> _IQueryStore
        {
            get
            {
                var queryStore = _Store.AsEnumerable(item => item.NextMedia)
                    .FirstOrDefault<IDataStore<T>, IQueryableDataStore<T>>();

                if (queryStore == null)
                {
                    throw new NotSupportedException($"{typeof(T)}没有IQueryableDataStore<{typeof(T)}>类型的存储容器!");
                }
                else
                {
                    return queryStore;
                }
            }
        }

        #region IDataStore<T>

        /// <summary>
        /// 获取数据
        /// </summary>
        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            return _Store.Get(keyGroup);
        }
        /// <summary>
        /// 新增数据
        /// </summary>
        public void Add(IEnumerable<T> @group)
        {
            _Store.Add(group);
        }
        /// <summary>
        /// 更新数据
        /// </summary>
        public void Update(IEnumerable<T> @group)
        {
            _Store.Update(group);
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        public void Delete(IEnumerable<string> @group)
        {
            _Store.Delete(group);
        }

        /// <summary>
        /// 获取所有数据
        /// </summary>
        public IEnumerable<T> GetAll()
        {
            return _Store.GetAll();
        }
        /// <summary>
        /// 删除所有数据
        /// </summary>
        public void DeleteAll()
        {
            _Store.DeleteAll();
        }

        /// <summary>
        /// 判断数据是否存在,如果存在则返回Key
        /// </summary>
        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            return _Store.Exist(keyGroup);
        }
        /// <summary>
        /// 获取数据总数
        /// </summary>
        public int Count()
        {
            return _Store.Count();
        }

        #endregion

        #region IQueryableDataStore<T>

        /// <summary>
        /// 查询数据(可按条件过滤、排序)
        /// </summary>
        public IEnumerable<T> Query(string @where=null, string order = null)
        {
            return _IQueryStore.Query(where, order);
        }
        /// <summary>
        /// 查询某页数据(可按条件过滤、排序)
        /// </summary>
        public IEnumerable<T> Query( int pageNum, int pageSize, string @where=null, string order = null)
        {
            return _IQueryStore.Query(pageNum, pageSize, where, order);
        }
        /// <summary>
        /// 批量更新数据
        /// </summary>
        public void Update(Expression<Func<T, bool>> whereExpress, Expression<Func<T, T>> updateExpress)
        {
            _IQueryStore.Update(whereExpress, updateExpress);
        }
        /// <summary>
        /// 批量删除数据
        /// </summary>
        public void Delete(Expression<Func<T, bool>> whereExpress)
        {
            _IQueryStore.Delete(whereExpress);
        }

        /// <summary>
        /// 批量判断数据是否存在
        /// </summary>
        public IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress)
        {
            return _IQueryStore.Exist(whereExpress);
        }
        /// <summary>
        /// 获取数据总数(可根据条件过滤)
        /// </summary>
        public int Count(Expression<Func<T, bool>> whereExpress)
        {
            return _IQueryStore.Count(whereExpress);
        }

        #endregion

        #region  IDataStore<T> Single

        /// <summary>
        /// 获取单个实体数据
        /// </summary>
        public T Get(string key)
        {
            ///ToDo:集合和单个实体的数据处理能不能统一?
            return Get(new List<string> {key}).FirstOrDefault();
        }
        /// <summary>
        /// 新增单个实体数据
        /// </summary>
        public void Add(T entity)
        {
            Add(new List<T> {entity});
        }
        /// <summary>
        /// 更新单个实体数据
        /// </summary>
        public void Update(T entity)
        {
            Update(new List<T> {entity});
        }
        /// <summary>
        /// 删除单个实体数据
        /// </summary>
        public void Delete(string key)
        {
            Delete(new List<string> {key});
        }

        /// <summary>
        /// 判断单个实体是否存在
        /// </summary>
        public bool Exist(string key)
        {
            var group = Exist(new List<string>() {key});

            return group.Any();
        }

        #endregion

        #region Others

        /// <summary>
        /// 删除实体数据
        /// </summary>
        /// <param name="group"></param>
        public void Delete(IEnumerable<T> group)
        {
            Delete(group.Select(item => item.Key_));
        }

        /// <summary>
        /// 删除单个实体数据
        /// </summary>
        public void Delete(T entity)
        {
            Delete(new List<T>() { entity });
        }

        #endregion
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 可查询的数据存储接口
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IQueryableDataStore<T> : IDataStore<T> where T : EntityBase
    {
        /// <summary>
        /// 查询数据(可按条件过滤、排序)
        /// </summary>
        IEnumerable<T> Query(string where, string order = null);
        /// <summary>
        /// 查询某页数据(可按条件过滤、排序)
        /// </summary>
        IEnumerable<T> Query(int pageNum, int pageSize, string where = null, string order = null);
        /// <summary>
        /// 批量更新数据
        /// </summary>
        void Update(Expression<Func<T, bool>> whereExpress, Expression<Func<T, T>> updateExpress);
        /// <summary>
        /// 批量删除数据
        /// </summary>
        void Delete(Expression<Func<T, bool>> whereExpress);

        /// <summary>
        /// 批量判断数据是否存在
        /// </summary>
        IEnumerable<string> Exist(Expression<Func<T, bool>> whereExpress);
        /// <summary>
        /// 获取数据总数(可根据条件过滤)
        /// </summary>
        int Count(Expression<Func<T, bool>> whereExpress);
    }
}
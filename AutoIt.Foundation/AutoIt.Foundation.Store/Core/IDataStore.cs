using System.Collections.Generic;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// 数据存储接口
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IDataStore<T> where T:EntityBase
    {   
        /// <summary>
        /// 获取数据
        /// </summary>
        IEnumerable<T> Get(IEnumerable<string> keyGroup);
        /// <summary>
        /// 新增数据
        /// </summary>
        void Add(IEnumerable<T> group);
        /// <summary>
        /// 更新数据
        /// </summary>
        void Update(IEnumerable<T> group);
        /// <summary>
        /// 删除数据
        /// </summary>
        void Delete(IEnumerable<string> group);

        /// <summary>
        /// 获取所有数据
        /// </summary>
        /// <returns></returns>
        IEnumerable<T> GetAll();
        /// <summary>
        /// 删除所有数据
        /// </summary>
        void DeleteAll();

        /// <summary>
        /// 判断数据是否存在,如果存在则返回Key
        /// </summary>
        IEnumerable<string> Exist(IEnumerable<string> keyGroup);
        /// <summary>
        /// 获取数据总数
        /// </summary>
        int Count();
    }
}
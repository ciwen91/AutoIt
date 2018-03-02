using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// 程序集帮助类
    /// </summary>
    public static class AssemblyHelper
    {
        /// <summary>
        /// 获取应用程序域中所有程序集
        /// </summary>
        /// <returns></returns>
        public static IEnumerable<Assembly> GetAllAssembly()
        {
            return AppDomain.CurrentDomain.GetAssemblies();
        }

        /// <summary>
        /// 获取应用程序域中所有类型
        /// </summary>
        public static IEnumerable<Type> GetAllType()
        {
            var typeGroup = GetAllAssembly().SelectMany(item => item.GetTypes())
                .ToList();

            return typeGroup;
        }

        /// <summary>
        /// 获取所有实现的类型
        /// </summary>
        public static IEnumerable<Type> GetAllRealizeType(this Type assignType)
        {
            var typeGroup = GetAllType()
                .Where(item => item.IsClass && !item.IsAbstract && assignType.IsAssignableFrom(item))//??? put in typehelper
                .ToList();

            return typeGroup;
        }

        /// <summary>
        /// 获取所有实现的实例
        /// </summary>
        public static IEnumerable<T> GetAllRealizeInstance<T>()
        {
            var typeGroup = GetAllRealizeType(typeof(T));

            var instanceGroup = typeGroup.Select(item => (T) Activator.CreateInstance(item))//???
                .ToList();

            return instanceGroup;
        }
    }
}

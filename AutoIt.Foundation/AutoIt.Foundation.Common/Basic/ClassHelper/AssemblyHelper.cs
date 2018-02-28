using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    public static class AssemblyHelper
    {
        public static IEnumerable<T> GetAllRealizeInstance<T>()
        {
            var typeGroup = GetAllRealizeType(typeof(T));

            var instanceGroup = typeGroup.Select(item => (T) Activator.CreateInstance(item))
                .ToList();

            return instanceGroup;
        }

        public static IEnumerable<Type> GetAllRealizeType(this Type assignType)
        {
            var typeGroup = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(
                    a =>
                        a.GetTypes()
                            .Where(item => item.IsClass && !item.IsAbstract&& assignType.IsAssignableFrom(item)))
                .ToList();

            return typeGroup;
        }
    }
}

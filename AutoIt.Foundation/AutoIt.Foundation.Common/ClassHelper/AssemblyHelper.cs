using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
   public static class AssemblyHelper
    {
        public static IEnumerable<Type> GetRealizeTypeGroup(Type assignType)
        {
            var typeGroup = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(
                    a =>
                        a.GetTypes()
                            .Where(item => assignType.IsAssignableFrom(item) && item.IsClass && !item.IsAbstract))
                .ToArray();

            return typeGroup;
        } 
    }
}

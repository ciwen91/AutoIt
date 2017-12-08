using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
    public static class ObjectHelper
    {
        public static IEnumerable<T> AsEnumerable<T>(this T obj,Func<T,T> nextFunc) where T:class
        {
            while (obj != null)
            {
                yield return obj;
                obj = nextFunc(obj);
            }
        }
    }
}

using System.Collections.Generic;

namespace AutoIt.Foundation.Common.ClassHelper
{
   public static class EnumerableHelper
    {
        public static IEnumerable<int> For(int num)
        {
            var group = new int[num];

            for (var i = 0; i < group.Length; i++)
            {
                group[i] = i;
            }

            return group;
        }
    }
}

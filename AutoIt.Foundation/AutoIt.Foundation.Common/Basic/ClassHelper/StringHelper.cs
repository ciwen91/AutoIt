using System.Text.RegularExpressions;

namespace AutoIt.Foundation.Common
{
    public static class StringHelper
    {
        /// <summary>
        /// 获取下一个位置
        /// </summary>
        /// <param name="startPoint">开始位置</param>
        /// <param name="count">跳过的元素个数</param>
        public static LinePoint NextPoint(this string str, LinePoint startPoint,int count)
        {
            var x = startPoint.X;
            var y = startPoint.Y;

            for (var i = startPoint.Index; i < startPoint.Index+count; i++)
            {
                //换行
                if (str[i] == '\n')
                {
                    x = 0;
                    y += 1;
                    
                }
                else if (str[i] == '\r')
                {
                   
                }
                else
                {
                    x += 1;
                }
            }

            var endPoint=new LinePoint(startPoint.Index+count,x,y);

            return endPoint;
        }

        /// <summary>
        /// 获取前一个位置
        /// </summary>
        /// <param name="startPoint">开始位置</param>
        /// <param name="count">跳过的元素个数</param>
        public static LinePoint PrePoint(this string str, LinePoint startPoint, int count)
        {
            var x = startPoint.X;
            var y = startPoint.Y;

            for (var i = startPoint.Index; i > startPoint.Index - count; i--)
            {
                //换行 x=0???
                if (str[i] == '\n')
                {
                    x = -1;
                    y -= 1;

                    var tmpIndex = i - 1;
                    while (tmpIndex >= 0 && str[tmpIndex] != '\n')
                    {
                        if (str[tmpIndex] != '\r')
                        {
                            x++;
                        }

                        tmpIndex--;
                    }
                }
                else if (str[i] == '\r')
                {

                }
                else
                {
                    x -= 1;
                }
            }

            var endPoint = new LinePoint(startPoint.Index - count, x, y);

            return endPoint;
        }

        /// <summary>
        /// 获取下一个匹配
        /// </summary>
        public static string MatchNext(this string str, string regex, int? index)
        {
            if (index == null)
            {
                index = 0;
            }

            if (index >= str.Length)
            {
                return null;
            }

            var val = str.Substring(index.Value);
            var result = Regex.Match(val, regex, RegexOptions.IgnoreCase | RegexOptions.Multiline).Value;

            return result;
        }

        /// <summary>
        /// 获取上一个匹配(RegexOptions.RightToLeft)
        /// </summary>
        public static string MatchPre(this string str, string regex, int? index)
        {
            if (index ==null)
            {
                index = str.Length - 1;
            }

            if (index < 0)
            {
                return null;
            }

            var val = str.Substring(0, index.Value + 1);
            var result =
                Regex.Match(val, regex, RegexOptions.IgnoreCase | RegexOptions.Multiline | RegexOptions.RightToLeft)
                    .Value;

            return result;
        }
    }
}

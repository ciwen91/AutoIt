using System.Text.RegularExpressions;

namespace AutoIt.Foundation.Common
{
    public static class StringHelper
    {
        public static LinePoint NextPoint(this string str, int count, LinePoint startPoint)
        {
            var x = startPoint.X;
            var y = startPoint.Y;

            for (var i = startPoint.Index; i < startPoint.Index+count; i++)
            {
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

        public static LinePoint PrePoint(this string str, int count, LinePoint startPoint)
        {
            var x = startPoint.X;
            var y = startPoint.Y;

            for (var i = startPoint.Index; i > startPoint.Index - count; i--)
            {
                if (str[i] == '\n')
                {
                    x = 0;
                    y -= 1;
                }
                else if (str[i] == '\r')
                {

                }
                else
                {
                    x -= 1;
                }
            }

            var endPoint = new LinePoint(startPoint.Index + count, x, y);

            return endPoint;
        }

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

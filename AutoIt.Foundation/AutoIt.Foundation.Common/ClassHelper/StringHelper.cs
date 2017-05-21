using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.Common.DataStruct;

namespace AutoIt.Foundation.Common.ClassHelper
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
    }
}

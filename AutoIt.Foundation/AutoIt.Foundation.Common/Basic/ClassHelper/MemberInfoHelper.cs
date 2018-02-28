using System;
using System.Collections.Generic;
using System.Reflection;

namespace AutoIt.Foundation.Common
{
    public static class MemberInfoHelper
    {
        public static object GetValue(this MemberInfo memberInfo, object obj)
        {
            if (memberInfo.MemberType == MemberTypes.Field)
            {
                return ((FieldInfo)memberInfo).GetValue(obj);
            }
            else if (memberInfo.MemberType == MemberTypes.Property)
            {
                return ((PropertyInfo)memberInfo).GetValue(obj);
            }
            else
            {
                throw new NotSupportedException();
            }
        }

        public static MemberInfo SetValue(this MemberInfo memberInfo, object obj, object val)
        {
            if (memberInfo.MemberType == MemberTypes.Field)
            {
                ((FieldInfo)memberInfo).SetValue(obj, val);
            }
            else if (memberInfo.MemberType == MemberTypes.Property)
            {
                ((PropertyInfo)memberInfo).SetValue(obj, val);
            }
            else
            {
                throw new NotSupportedException();
            }

            return memberInfo;
        }
    }
}

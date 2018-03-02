using System;
using System.Collections.Generic;
using System.Reflection;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// 成员元信息帮助类
    /// </summary>
    public static class MemberInfoHelper
    {
        /// <summary>
        /// 获取对象的成员值
        /// </summary>
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

        /// <summary>
        /// 设置对象的成员值
        /// </summary>
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

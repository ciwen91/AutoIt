using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using AutoIt.Foundation.Common.DataStruct.KeyValue;
using Compiler.Common;

namespace AutoIt.Foundation.Common.Binding
{
    /// <summary>
    /// 绑定
    /// </summary>
    public class Binding
    {
        /// <summary>
        /// 建立绑定
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="target">绑定目标</param>
        /// <param name="source">绑定源</param>
        public static void Bind<T>(Expression<Func<T>> target, Expression<Func<T>> source)
        {
            //将绑定信息添加到上下文中
            var group = Context.Current.GetOrSet(new List<BindInfo>());
            group.Add(new BindInfo(target, source));
        }

        /// <summary>
        /// 更新绑定目标
        /// </summary>
        public static void Update()
        {
            //从上下文中获取绑定信息
            var group = Context.Current.Get<List<BindInfo>>();

            //更新绑定目标
            if (group != null)
            {
                foreach (var item in group)
                {
                    item.Update();
                }
            }
        }
    }
}

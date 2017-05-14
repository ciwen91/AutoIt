using AutoIt.Foundation.Common.Expression;

namespace AutoIt.Foundation.Common.Binding
{
    /// <summary>
    /// 绑定信息
    /// </summary>
    public class BindInfo
    {
        /// <summary>
        /// 绑定目标
        /// </summary>
        public System.Linq.Expressions.Expression Target { get; set; }
        /// <summary>
        /// 绑定源
        /// </summary>
        public System.Linq.Expressions.Expression Source { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="target">绑定目标</param>
        /// <param name="source">绑定源</param>
        public BindInfo(System.Linq.Expressions.Expression target, System.Linq.Expressions.Expression source)
        {
            this.Target = target;
            this.Source = source;
        }

        /// <summary>
        /// 更新绑定目标
        /// </summary>
        /// <returns></returns>
        public BindInfo Update()
        {
            //创建成员表达式访问者
            var visitor = new MemberVisitor();

            //获取源的当前值
            var sourceVal = visitor.GetValue(Source);
            //更新绑定目标
            visitor.SetValue(Target, sourceVal);

            return this;
        }
    }
}
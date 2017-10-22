using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Autofac;
using Castle.DynamicProxy;

namespace AutoIt.Foundation.Aop
{
   public class Call1Logger:IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            var paramGroup = invocation.Arguments.Select(item => item.ToString()).ToList();
            Console.WriteLine("{0}.{1}({2})", invocation.TargetType.FullName, invocation.Method.Name,
                string.Join(",", paramGroup));

            invocation.Proceed();

            Console.WriteLine(invocation.ReturnValue);
        }
    }
}

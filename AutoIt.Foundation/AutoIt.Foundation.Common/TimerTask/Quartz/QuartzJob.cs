using System;
using Quartz;

namespace AutoIt.Foundation.Common
{
    /// <summary>
    /// DisallowConcurrentExecution,����ʵ��������ִ������
    /// </summary>
    [DisallowConcurrentExecution]
    public class QuartzJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            var action = (Action) context.JobDetail.JobDataMap["Action"];

            action();
        }
    }
}
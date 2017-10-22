using System;
using Quartz;

namespace TimerTask
{
    /// <summary>
    /// DisallowConcurrentExecution,对于实例不并发执行任务
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
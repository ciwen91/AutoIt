using System;
using Quartz;

namespace TimerTask
{
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
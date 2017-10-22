using System;
using System.Diagnostics;
using Quartz;
using Quartz.Listener;

namespace TimerTask
{
    public class JobListener: JobListenerSupport
    {
        public override string Name => "JobListener";

        public override void JobToBeExecuted(IJobExecutionContext context)
        {
            var jobKey = context.JobDetail.Key;
            var nextTime = context.NextFireTimeUtc?.LocalDateTime;
            Trace.WriteLine($"{DateTime.Now} {jobKey}:JobToBeExecuted,NextTime {nextTime}");
        }

        public override void JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException)
        {
            var jobKey = context.JobDetail.Key;
            var nextTime = context.NextFireTimeUtc?.LocalDateTime;
            var result = context.Result;
            Trace.WriteLine($"{DateTime.Now} {jobKey}:JobWasExecuted {result}");
           
            if (jobException != null)
            {
                var exp = jobException.InnerException.InnerException;
                Trace.WriteLine(exp.Message);
            }
        }

        /// <summary>
        /// 可以在这里否决任务执行(相当于开关)
        /// </summary>
        public override void JobExecutionVetoed(IJobExecutionContext context)
        {
            Trace.WriteLine("JobExecutionVetoed");
        }
    }
}
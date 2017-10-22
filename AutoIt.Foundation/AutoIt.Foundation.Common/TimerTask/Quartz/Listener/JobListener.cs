using System;
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
            var nextTime = context.NextFireTimeUtc.Value.LocalDateTime;
            Console.WriteLine($"{DateTime.Now} {jobKey}:JobToBeExecuted,NextTime {nextTime}");
        }

        public override void JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException)
        {
            var jobKey = context.JobDetail.Key;
            var nextTime = context.NextFireTimeUtc.Value.LocalDateTime;
            var result = context.Result;
            Console.WriteLine($"{DateTime.Now} {jobKey}:JobWasExecuted {result}");
           
            if (jobException != null)
            {
                var exp = jobException.InnerException.InnerException;
                Console.WriteLine(exp.Message);
            }
        }

        public override void JobExecutionVetoed(IJobExecutionContext context)
        {
            Console.WriteLine("JobExecutionVetoed");
        }
    }
}
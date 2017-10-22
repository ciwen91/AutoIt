using System;
using System.Diagnostics;
using Quartz;
using Quartz.Listener;

namespace TimerTask
{
    public class SchedulerListener : SchedulerListenerSupport
    {
        public override void JobAdded(IJobDetail jobDetail)
        {
            Trace.WriteLine($"{DateTime.Now} {jobDetail.Key}:JobAdded");
        }

        public override void JobDeleted(JobKey jobKey)
        {
            Trace.WriteLine($"{DateTime.Now} {jobKey}:JobDeleted");
        }

        public override void JobPaused(JobKey jobKey)
        {
            Trace.WriteLine($"{DateTime.Now} {jobKey}:JobPaused");
        }

        public override void JobResumed(JobKey jobKey)
        {
            Trace.WriteLine($"{DateTime.Now} {jobKey}:JobResumed");
        }


        public override void SchedulerStarted()
        {
            Trace.WriteLine($"{DateTime.Now}:SchedulerStarted");
        }

        public override void SchedulerShutdown()
        {
            Trace.WriteLine($"{DateTime.Now}:SchedulerShutdown");
        }
    }
}
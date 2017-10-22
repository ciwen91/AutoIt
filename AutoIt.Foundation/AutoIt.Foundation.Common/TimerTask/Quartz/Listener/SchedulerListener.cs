using System;
using Quartz;
using Quartz.Listener;

namespace TimerTask
{
    public class SchedulerListener : SchedulerListenerSupport
    {
        public override void JobAdded(IJobDetail jobDetail)
        {
            Console.WriteLine($"{DateTime.Now} {jobDetail.Key}:JobAdded");
        }

        public override void JobDeleted(JobKey jobKey)
        {
            Console.WriteLine($"{DateTime.Now} {jobKey}:JobDeleted");
        }

        public override void JobPaused(JobKey jobKey)
        {
            Console.WriteLine($"{DateTime.Now} {jobKey}:JobPaused");
        }

        public override void JobResumed(JobKey jobKey)
        {
            Console.WriteLine($"{DateTime.Now} {jobKey}:JobResumed");
        }


        public override void SchedulerStarted()
        {
            Console.WriteLine($"{DateTime.Now}:SchedulerStarted");
        }

        public override void SchedulerShutdown()
        {
            Console.WriteLine($"{DateTime.Now}:SchedulerShutdown");
        }

        //public override void SchedulerError(string msg, SchedulerException cause)
        //{
        //    Console.WriteLine($"{DateTime.Now}:SchedulerError {msg}");
        //}
    }
}
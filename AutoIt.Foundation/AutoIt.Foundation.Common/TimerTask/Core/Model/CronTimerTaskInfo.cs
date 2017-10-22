using System;
using Common.Logging.Configuration;

namespace TimerTask
{
    public class CronTimerTaskInfo : TimerTaskInfo
    {
        public string Cron { get; set; }

        public CronTimerTaskInfo()
        {
            
        }

        public CronTimerTaskInfo(Action action, string cron)
        {
            this.Action = action;
            this.Cron = cron;
        }
    }
}
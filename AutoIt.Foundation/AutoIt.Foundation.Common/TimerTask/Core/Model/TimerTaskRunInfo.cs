using System;

namespace AutoIt.Foundation.Common
{
    public class TimerTaskRunInfo
    {
        public TimerTaskInfo TaskInfo { get; set; }

        public DateTime? FinalFireTime { get; set; }
        public DateTime? NextFireTime { get; set; }
        public int FireTimes { get; set; }
    }
}
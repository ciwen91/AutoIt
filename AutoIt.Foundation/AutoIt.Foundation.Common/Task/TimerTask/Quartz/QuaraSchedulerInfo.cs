using System;

namespace AutoIt.Foundation.Common
{
    public class QuaraSchedulerInfo
    {
        public string Version { get; set; }
        public bool Started { get; set; }
        public bool Shutdown { get; set; }
        public DateTime? RunningSince { get; set; }
        public int NumberOfJobsExecuted { get; set; }  
        public int ThreadPoolSize { get; set; }   
    }
}
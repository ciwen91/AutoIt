using System;
using Newtonsoft.Json;

namespace TimerTask
{
    public  class TimerTaskScheduler:ITimerTaskScheduler
    {
        public static TimerTaskScheduler Default =new TimerTaskScheduler();

        private QuartzScheduler _QuartzScheduler=new QuartzScheduler();

        public void Start(int threadCount)
        {
            _QuartzScheduler.Start(threadCount);
        }

        public void Stop()
        {
            _QuartzScheduler.Stop();
        }

        public void AddTask(SimpleTimerTaskInfo taskInfo)
        {
            _QuartzScheduler.AddTask(taskInfo);
            Console.WriteLine(JsonConvert.SerializeObject(_QuartzScheduler.GetTaskRunInfo()));
        }

        public void AddTask(CronTimerTaskInfo taskInfo)
        {
            _QuartzScheduler.AddTask(taskInfo);
        }

        public void RemoveTask(string key, string group)
        {
            _QuartzScheduler.RemoveTask(key, group);
        }
    }
}
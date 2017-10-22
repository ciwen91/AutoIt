namespace TimerTask
{
    public interface ITimerTaskScheduler
    {
        void Start(int threadCount);
        void Stop();
        void AddTask(SimpleTimerTaskInfo taskInfo);
        void AddTask(CronTimerTaskInfo taskInfo);
        void RemoveTask(string key, string group);

    }
}
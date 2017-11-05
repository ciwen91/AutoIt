using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using Common.Logging.Configuration;
using Quartz;
using Quartz.Impl;

namespace AutoIt.Foundation.Common
{
    public class QuartzScheduler:ITimerTaskScheduler
    {
        private IScheduler _Scheduler;

        public QuartzScheduler()
        {
            _Scheduler = StdSchedulerFactory.GetDefaultScheduler();

            _Scheduler.ListenerManager.AddJobListener(new JobListener());
            _Scheduler.ListenerManager.AddTriggerListener(new TriggerListener());
            _Scheduler.ListenerManager.AddSchedulerListener(new SchedulerListener());
        }

        #region Scheduler

        public void Start(int threadCount)
        {
            _Scheduler.Context["quartz.threadPool.threadCount"] = threadCount;//???

            _Scheduler.Start();
        }

        public void Stop()
        {
            _Scheduler.Shutdown();
        }

        #endregion

        #region Task

        public void AddTask(SimpleTimerTaskInfo taskInfo)
        {
            var job = BuildTask(taskInfo)
                .Build();

            var trigger = BuildTrigger(taskInfo)
                .WithSimpleSchedule(s => s
                    .WithIntervalInSeconds(taskInfo.RepeatInterval)
                    .WithRepeatCount(taskInfo.RepeatCount))
                .Build();

            _Scheduler.ScheduleJob(job, trigger);
        }

        public void AddTask(CronTimerTaskInfo taskInfo)
        {
            var job = BuildTask(taskInfo)
                .Build();

            var trigger = BuildTrigger(taskInfo)
                .WithCronSchedule(taskInfo.Cron)
                .Build();

            _Scheduler.ScheduleJob(job, trigger);
        }

        public void RemoveTask(string key, string group)
        {
            _Scheduler.DeleteJob(new JobKey(key, group));
        }

        #endregion

        #region RunInfo

        public IEnumerable<TimerTaskRunInfo> GetTaskRunInfo()
        {
            var group = _Scheduler.GetJobKeys(null);

            var result = group.Select(_Scheduler.GetJobDetail)
                .Select(item =>
                {
                    var runInfo = new TimerTaskRunInfo();

                    var trigger = _Scheduler.GetTriggersOfJob(item.Key).FirstOrDefault();

                    if (trigger is ISimpleTrigger)
                    {
                        var simpleTaskInfo = new SimpleTimerTaskInfo();

                        simpleTaskInfo.RepeatCount = ((ISimpleTrigger)trigger).RepeatCount;
                        simpleTaskInfo.RepeatInterval = (int)((ISimpleTrigger)trigger).RepeatInterval.TotalSeconds;
                        runInfo.FireTimes = ((ISimpleTrigger)trigger).TimesTriggered;

                        runInfo.TaskInfo = simpleTaskInfo;
                    }
                    else if (trigger is ICronTrigger)
                    {
                        var cronTaskInfo = new CronTimerTaskInfo();

                        cronTaskInfo.Cron = ((ICronTrigger)trigger).CronExpressionString;

                        runInfo.TaskInfo = cronTaskInfo;
                    }

                    if (trigger is ITrigger && runInfo.TaskInfo != null)
                    {
                        var taskInfo = runInfo.TaskInfo;

                        taskInfo.Key = item.Key.Name;
                        taskInfo.Group = item.Key.Group;
                        taskInfo.Desc = item.Description;
                        taskInfo.StartTime = trigger.StartTimeUtc.LocalDateTime;
                        taskInfo.EndTime = trigger.EndTimeUtc?.LocalDateTime;

                        runInfo.FinalFireTime = trigger.GetPreviousFireTimeUtc()?.LocalDateTime;
                        runInfo.NextFireTime = trigger.GetNextFireTimeUtc()?.LocalDateTime;
                    }

                    return runInfo;
                })
                .ToList();

            return result;
        }

        public QuaraSchedulerInfo GetSchedulerInfo()
        {
            var meta = _Scheduler.GetMetaData();

            var info = new QuaraSchedulerInfo()
            {
                Version = meta.Version,
                Started = meta.Started,
                Shutdown = meta.Shutdown,
                RunningSince = meta.RunningSince?.LocalDateTime,
                NumberOfJobsExecuted = meta.NumberOfJobsExecuted,
                ThreadPoolSize = meta.ThreadPoolSize
            };

            return info;
        }

        #endregion

        #region Inner 

        private JobBuilder BuildTask(TimerTaskInfo taskInfo)
        {
            var job = JobBuilder.Create<QuartzJob>()
                .WithIdentity(taskInfo.Key, taskInfo.Group)
                .WithDescription(taskInfo.Desc)
                .SetJobData(new JobDataMap() {{"Action", taskInfo.Action}});

            return job;
        }

        private TriggerBuilder BuildTrigger(TimerTaskInfo taskInfo)
        {
            var trigger = TriggerBuilder.Create()
                .WithIdentity(taskInfo.Key + "Trigger", taskInfo.Group)
                .WithDescription(taskInfo.Desc);

            if (taskInfo.StartTime != null)
            {
                trigger = trigger.StartAt(taskInfo.StartTime.Value);
            }

            if (taskInfo.EndTime != null)
            {
                trigger = trigger.EndAt(taskInfo.EndTime.Value);
            }

            return trigger;
        }

        #endregion
    }
}

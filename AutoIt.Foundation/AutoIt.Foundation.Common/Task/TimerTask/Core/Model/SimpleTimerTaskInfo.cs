using System;

namespace AutoIt.Foundation.Common
{
    public class SimpleTimerTaskInfo:TimerTaskInfo
    {
        public int RepeatCount { get; set; }
        public int RepeatInterval { get; set; }

        public SimpleTimerTaskInfo()
        {
            
        }

        public SimpleTimerTaskInfo(Action action,int inrerval)
        {
            this.Action = action;
            this.RepeatInterval = inrerval;
        }
    }
}
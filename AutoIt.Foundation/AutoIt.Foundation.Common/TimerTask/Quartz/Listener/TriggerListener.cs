using System;
using Quartz;
using Quartz.Listener;

namespace TimerTask
{
    public class TriggerListener : TriggerListenerSupport
    {
        public override string Name => "TriggerListener";
    }
}
using System;
using Quartz;
using Quartz.Listener;

namespace AutoIt.Foundation.Common
{
    public class TriggerListener : TriggerListenerSupport
    {
        public override string Name => "TriggerListener";
    }
}
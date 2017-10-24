using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TimerTask
{
    public abstract class TimerTaskInfo
    {
        public string Key { get; set; } = Guid.NewGuid().ToString();
        public string Group { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Desc { get; set; }

        public Action Action { get; set; }
    }
}

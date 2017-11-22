using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoIt.Foundation.Common
{
  public static class LogHelper
  {
      public static Action<string> WriteLineAction;
      public static bool Enable { get; set; }

      public static void WriteLine(string str)
      {
          if (Enable)
          {
              WriteLineAction?.Invoke(str);
          }
      }
  }
}

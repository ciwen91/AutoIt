using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StoreCenter
{
    public class StoreConfig
    {
        //数据类型
        public Type DataType { get; set; }
        //存储结构
        public StoreShape Shape { get; set; }
        //加载方式
        public bool IsLoadAll { get; set; }

        //存储煤质集合
        public IEnumerable<StoreConfigItem> Group { get; set; }
    }
}

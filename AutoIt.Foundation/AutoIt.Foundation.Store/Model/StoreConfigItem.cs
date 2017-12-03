namespace AutoIt.Foundation.Store
{
    public class StoreConfigItem
    {
        // 存储类型
        public StoreType Type { get; set; }

        //生命周期
        public int? AbsluteExpires { get; set; }
        public int? SlideExpires { get; set; }

        //缓冲
        public int MaxBufferTime { get; set; }
        public int? MaxBufferCount { get; set; }

        public StoreConfigItem(StoreType type)
        {
            this.Type = type;
        }
    }
}
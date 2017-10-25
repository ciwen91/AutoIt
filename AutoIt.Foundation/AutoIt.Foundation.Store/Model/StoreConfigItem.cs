namespace StoreCenter
{
    public class StoreConfigItem
    {
        //生命周期
        public int? AbsluteExpires { get; set; }
        public int? SlideExpires { get; set; }

        //缓冲
        public int? MaxBufferTime { get; set; }
        public int? MaxBufferCount { get; set; }
    }
}
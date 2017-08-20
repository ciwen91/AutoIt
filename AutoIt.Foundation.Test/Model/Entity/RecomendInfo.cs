namespace Entity
{
    public class RecomendInfo : EntityBase
    {
        public int ProdID { get; set; }
        public LinkType LinkType { get; set; }
        public string PackName { get; set; }
        public string AppName { get; set; }
        public string Content { get; set; }
        public string Descript { get; set; }
        public string StartTime { get; set; }1
        public string EndTime { get; set; }
        public ShowMode ShowMode { get; set; }
        public int ShowCount { get; set; }
        public ShowTimeMode ShowTimeMode { get; set; }
        public int DisplaySecond { get; set; }
        public OpenState OpenState { get; set; }
        public int Probability { get; set; } 
    }
}
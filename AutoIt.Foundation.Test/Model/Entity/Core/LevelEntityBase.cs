namespace Entity
{
    public abstract class LevelEntityBase : EntityBase
    {
        public int? ParentID { get; set; }
        public string Code { get; set; }
        public string LevelCode { get; set; }      
    }
}
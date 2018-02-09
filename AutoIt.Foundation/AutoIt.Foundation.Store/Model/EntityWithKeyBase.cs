using System.ComponentModel.DataAnnotations;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// Key为主键的实体基类
    /// </summary>
    public abstract class EntityWithKeyBase : EntityBase
    {
        [Key]
        public string Key { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace AutoIt.Foundation.Store
{
    public abstract class EntityWithKeyBase : EntityBase
    {
        [Key]
        public string Key { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// ID为主键的实体基类
    /// </summary>
    public abstract class EntityWithIDBase : EntityBase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
    }
}
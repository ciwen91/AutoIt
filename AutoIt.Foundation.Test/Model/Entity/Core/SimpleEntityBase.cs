using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entity
{
    public abstract class SimpleEntityBase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }
        public DateTime CreatTime { get; set; }

        protected SimpleEntityBase()
        {
            this.CreatTime = DateTime.Now;
        }
    }
}
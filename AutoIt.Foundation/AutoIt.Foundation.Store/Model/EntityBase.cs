using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Store
{
    public abstract class EntityBase
    {
        [JsonIgnore]
        [NotMapped]
        public string Key_
        {
            get { return ID.ToString(); }
        }

        public int ID { get; set; }

        public DateTime CreateTime { get; set; }=DateTime.Now;
    }
}
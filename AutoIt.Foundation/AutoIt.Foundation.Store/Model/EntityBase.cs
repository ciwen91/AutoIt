using System;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Store
{
    public abstract class EntityBase
    {
        [JsonIgnore]
        public string Key_
        {
            get { return ID.ToString(); }
        }

        public int ID { get; set; }

        public DateTime CreateTime { get; set; }=DateTime.Now;
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;

namespace AutoIt.Foundation.Store
{
    public abstract class EntityBase
    {
        [JsonIgnore]
        [NotMapped]
        public string Key_ => string.Join("$", KeyGroup_);


        [JsonIgnore]
        [NotMapped]
        public IEnumerable<object> KeyGroup_
        {
            get
            {
                var keyMemberGroup = GetKeyInfoGroup(GetType());

                var valGroup = keyMemberGroup.Select(item => item.GetValue(this))
                    .ToList();

                return valGroup;
            }
        }

        public DateTime CreateTime { get; set; }=DateTime.Now;


        #region 获取主键信息

        public static IEnumerable<string> GetKeyNameGroup(Type type)
        {
            var keyNameGroup = GetKeyInfoGroup(type).Select(item => item.Name)
                    .ToList();

            return keyNameGroup;
        }

        public static IEnumerable<PropertyInfo> GetKeyInfoGroup(Type type)
        {
            var keyInfoGroup = type
                 .GetProperties()
                 .Where(item => item.GetCustomAttribute(typeof(KeyAttribute)) != null)
                 .ToList();

            return keyInfoGroup;
        }

        public static Dictionary<string,string> GetKeyNameValueDic(Type type,string key)
        {
            var keyNameGroup = GetKeyNameGroup(type);
            var keyValueGroup = key.Split('$');

            var dic=new Dictionary<string,string>();

            for (var i = 0; i < keyNameGroup.Count(); i++)
            {
                dic.Add(keyNameGroup.ElementAt(i), keyValueGroup[i]);
            }

            return dic;
        }

        #endregion


    }
}
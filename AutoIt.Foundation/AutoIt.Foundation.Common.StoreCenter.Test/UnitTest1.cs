using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StoreCenter;
using Xunit;

namespace AutoIt.Foundation.Common
{
    public class UnitTest1
    {
        [Fact]
        public void TestMethod1()
        {
            RedisRepository.ConStr.Default = "127.0.0.1:6379,password=adminzxly";

           global::StoreCenter.StoreCenter.SetConfig(new StoreConfig()
           {
               DataType = typeof(Student),
               Group = new List<StoreConfigItem>()
               {
                   new StoreConfigItem()
                   {
                      Type =StoreType.RedisCache,
                      AbsluteExpires = 1000
                   }
               },
               IsLoadAll = true,
               Shape = StoreShape.KeyValue
           });
    
            new StoreCenter<Student>().Add(new[] {new Student() {ID = 1, Key_ = "1", Name = "A"}});
        }
    }

    public class Student:EntityBase
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }
}

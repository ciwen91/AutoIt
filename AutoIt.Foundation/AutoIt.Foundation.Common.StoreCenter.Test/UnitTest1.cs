﻿using System;
using System.Collections.Generic;
using AutoIt.Foundation.Store;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;

namespace AutoIt.Foundation.Common
{
    public class BaseTest
    {
        static BaseTest()
        {
            RedisRepository.ConStr.Default = "127.0.0.1:6379,password=adminzxly";
            EFRepository.ConStr.Default =
                "Data Source = 127.0.0.1;Initial Catalog = Test;User Id = sa;Password = 1qaz7410;";
        }

        [Fact]
        public void TestMethod1()
        {
            StoreCenter.SetConfig(new StoreConfig()
            {
                DataType = typeof(Student),
                Group = new List<StoreConfigItem>()
                {
                    new StoreConfigItem()
                    {
                        Type = StoreType.RedisCache,
                        AbsluteExpires = 1000
                    },
                    new StoreConfigItem()
                    {
                        Type = StoreType.DBStore
                    }
                },
                IsLoadAll = true,
                Shape = StoreShape.KeyValue
            });

            new StoreCenter<Student>().Add(new[] {new Student() {Name = "A"}});
        }
    }

    public class Student:EntityBase
    {
        public string Name { get; set; }
    }
}

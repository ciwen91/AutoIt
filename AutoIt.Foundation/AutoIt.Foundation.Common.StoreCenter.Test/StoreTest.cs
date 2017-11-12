using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using AutoIt.Foundation.Store;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;
using Xunit.Abstractions;
using Assert = Xunit.Assert;

namespace AutoIt.Foundation.Store.Test
{
    public class StoreTest:TestBase
    {
        private StoreCenter<Student> _StoreCenter;
        private List<Student> _DataGroup = new List<Student>();



        public StoreTest(ITestOutputHelper output):base(output)
        {

        }

        private void Init(string caseName)
        {
            RedisRepository.ConStr.Default = "127.0.0.1:6379,password=adminzxly,allowAdmin = true";
            EFRepository.ConStr.Default =
                "Data Source = 127.0.0.1;Initial Catalog = Test;User Id = sa;Password = 1qaz7410;";

            new EFStore<Student>().Truncate();
            new RedisRepository().FlushAll();

            var storeConfig = new StoreConfig()
            {
                DataType = typeof(Student),
                Shape = caseName.EndsWith(".KeyValue") ? StoreShape.KeyValue : StoreShape.Dic,
                IsLoadAll = true
            };
           
            if (caseName.StartsWith("Redis."))
            {
                storeConfig.Group = new List<StoreConfigItem>()
                {
                    new StoreConfigItem()
                    {
                        Type = StoreType.RedisCache,                       
                       AbsluteExpires = 1000
                    }
                };
            }
            else if (caseName.StartsWith("ProcCache."))
            {
                storeConfig.Group = new List<StoreConfigItem>()
                {
                    new StoreConfigItem()
                    {
                        Type = StoreType.ProcCache,
                        AbsluteExpires = 1000
                    }
                };
            }
            else 
            {
                storeConfig.Group = new List<StoreConfigItem>()
                {
                    new StoreConfigItem()
                    {
                        Type = StoreType.DBStore
                    }
                };
            }

            StoreCenter.SetConfig(storeConfig);

            _StoreCenter=new StoreCenter<Student>();

            for (var i = 0; i < 10; i++)
            {
                var entity = new Student()
                {
                    ID = i+1,
                    Name = "张三" + i
                };

                _DataGroup.Add(entity);
            }

            _StoreCenter.Add(_DataGroup);
        }

        #region Data

        public static IEnumerable<object[]> MemberData => new List<object[]>()
        {
            new object[] {"ProcCache.KeyValue"},
            new object[] {"ProcCache.Dic"},
            new object[] {"Redis.KeyValue"},
            new object[] {"Redis.Dic"},
            new object[] { "DBStore.KeyValue" },
            new object[] { "DBStore.Dic" }
        };

        #endregion

        public StoreShape GetShape(string caseName)
        {
            if (caseName.EndsWith("KeyValue")&&!caseName.StartsWith("DBStore"))
            {
                return StoreShape.KeyValue;
            }
            else
            {
                return StoreShape.Dic;
            }
        }

        #region IDataStore<Student> 

        [Theory]
        [MemberData("MemberData")]
        public void GetAll(string caseName)
        {
            Init(caseName);

            var group = _StoreCenter.Get();

            if (GetShape(caseName) == StoreShape.Dic)
            {
                Assert.Equal(_DataGroup.Count, group.Count());
            }
            else
            {
                Assert.Equal(null, group);
            }
        
        }

        [Theory]
        [MemberData("MemberData")]
        public void Get(string caseName)
        {
            Init(caseName);

            var entity = _StoreCenter.Get("1");
            Assert.Equal(_DataGroup.First().Name, entity.Name);

            entity = _StoreCenter.Get("11");
            Assert.Equal(null, entity);
        }

        [Theory]
        [MemberData("MemberData")]
        public void Add(string caseName)
        {
            Init(caseName);

            Assert.Equal(null,_StoreCenter.Get("11"));

            _StoreCenter.Add(new Student()
            {
                ID=11,
                Name = "刘备"
            });

            Assert.Equal("刘备", _StoreCenter.Get("11").Name);
        }

        [Theory]
        [MemberData("MemberData")]
        public void Update(string caseName)
        {
            Init(caseName);

            var entity = _StoreCenter.Get("1");
            entity.Name = "刘备";
            _StoreCenter.Update(entity);

            Assert.Equal("刘备", _StoreCenter.Get("1").Name);
        }

        [Theory]
        [MemberData("MemberData")]
        public void Delete(string caseName)
        {
            Init(caseName);

            Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);

            _StoreCenter.Delete("1");

            Assert.Equal(null, _StoreCenter.Get("1"));
        }

        [Theory]
        [MemberData("MemberData")]
        public void Exist(string caseName)
        {
            Init(caseName);

            Assert.Equal(true,_StoreCenter.Exist("1"));

            Assert.Equal(false, _StoreCenter.Exist("11"));
        }

        [Theory]
        [MemberData("MemberData")]
        public void Count(string caseName)
        {
            Init(caseName);

            if (GetShape(caseName) == StoreShape.Dic)
            {
                Assert.Equal(_DataGroup.Count(), _StoreCenter.Count());
            }
            else
            {
                Assert.Equal(-1, _StoreCenter.Count());
            }
        }

        #endregion

    }
}

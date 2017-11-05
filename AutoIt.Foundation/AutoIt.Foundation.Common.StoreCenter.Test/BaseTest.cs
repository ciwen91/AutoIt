using System;
using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Store;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Xunit;

namespace AutoIt.Foundation.Store.Test
{
    public class BaseTest
    {
        private StoreCenter<Student> _StoreCenter = new StoreCenter<Student>();

        static BaseTest()
        {
            RedisRepository.ConStr.Default = "127.0.0.1:6379,password=adminzxly";
            EFRepository.ConStr.Default =
                "Data Source = 127.0.0.1;Initial Catalog = Test;User Id = sa;Password = 1qaz7410;";
        }

        //[Fact]
        //public void TestMethod1()
        //{
        //    StoreCenter.SetConfig(new StoreConfig()
        //    {
        //        DataType = typeof(Student),
        //        Group = new List<StoreConfigItem>()
        //        {
        //            new StoreConfigItem()
        //            {
        //                Type = StoreType.RedisCache,
        //                AbsluteExpires = 1000
        //            },
        //            new StoreConfigItem()
        //            {
        //                Type = StoreType.DBStore
        //            }
        //        },
        //        IsLoadAll = true,
        //        Shape = StoreShape.KeyValue
        //    });

        //    new StoreCenter<Student>().Add(new[] {new Student() {Name = "A"}});
        //}

        #region Data

        public static IEnumerable<object[]> GetMemberData()
        {
            return new List<object[]>()
            {
                new object[] {"Redis"},
                new object[] {"DBStore"}
            };
        }

        public static IEnumerable<object[]> GetMemberData_Key()
        {
            var group = GetMemberData().Select(item =>
            {
                var result = new List<object>(item)
                {
                    new List<string>() {"1"}
                };

                return result.ToArray();
            });

            return group;
        }

        public static IEnumerable<object[]> GetMemberData_Entity()
        {
            var group = GetMemberData().Select(item =>
            {
                var result = new List<object>(item)
                {
                    new List<Student>()
                    {
                        new Student() {Name = "a"}
                    }
                };

                return result.ToArray();
            });

            return group;
        }

        #endregion

        #region IDataStore<Student> 

        [Theory]
        [MemberData("GetMemberData")]
        public IEnumerable<Student> Get(string memberType)
        {
            return _StoreCenter.Get();
        }

        [Theory]
        [MemberData("GetMemberData_Key")]
        public IEnumerable<Student> Get(string memberType,IEnumerable<string> keyGroup)
        {
            return _StoreCenter.Get(keyGroup);
        }

        [Theory]
        [MemberData("GetMemberData_Entity")]
        public void Add(string memberType, IEnumerable<Student> @group)
        {
            _StoreCenter.Add(group);
        }

        [Theory]
        [MemberData("GetMemberData_Entity")]
        public void Update(string memberType, IEnumerable<Student> @group)
        {
           _StoreCenter.Update(group);
        }

        [Theory]
        [MemberData("GetMemberData_Entity")]
        public void Delete(string memberType, IEnumerable<string> @group)
        {
            _StoreCenter.Delete(group);
        }

        [Theory]
        [MemberData("GetMemberData_Key")]
        public IEnumerable<string> Exist(string memberType, IEnumerable<string> keyGroup)
        {
            return _StoreCenter.Exist(keyGroup);
        }

        [Theory]
        [MemberData("GetMemberData")]
        public int Count(string memberType)
        {
            return _StoreCenter.Count();
        }

        #endregion

    }
}

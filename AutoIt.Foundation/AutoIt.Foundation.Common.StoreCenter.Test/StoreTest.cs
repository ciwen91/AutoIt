using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.Caching;
using System.Runtime.InteropServices;
using System.Threading;
using AutoIt.Foundation.Common;
using AutoIt.Foundation.Store;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Xunit;
using Xunit.Abstractions;
using Assert = Xunit.Assert;

namespace AutoIt.Foundation.Store.Test
{
    public class StoreTest:TestBase
    {
        private StoreCenter<Student> _StoreCenter;
        private List<Student> _DataGroup = new List<Student>();


        public static IEnumerable<object[]> TestData
        {
            get { return _CaseGroup.Select(item => new object[] { item.CaseName }); }
        }

        static StoreTest()
        {
            var storeTypeGroup = Enum.GetNames(typeof(StoreType));
            var storeShapeGroup = Enum.GetNames(typeof(StoreShape));

            //单个存储测试
            foreach (var typeItem in storeTypeGroup)
            {
                foreach (var shapeItem in storeShapeGroup)
                {
                    _CaseGroup.Add(new CaseInfo($"{typeItem}.{shapeItem}",
                        (StoreShape) Enum.Parse(typeof(StoreShape), shapeItem), new List<StoreConfigItem>()
                        {
                            new StoreConfigItem((StoreType) Enum.Parse(typeof(StoreType), typeItem))
                        }));
                }
            }
        }

        public StoreTest(ITestOutputHelper output):base(output)
        {

        }

        private void InitCase(string caseName,Action<StoreConfig> action=null )
        {
            LogHelper.Enable = false;

            #region InitConfig

            #region ConStr

            RedisRepository.ConStr.Default = "127.0.0.1:6379,password=adminzxly,allowAdmin = true";
            EFRepository.ConStr.Default =
                "Data Source = 127.0.0.1;Initial Catalog = Test;User Id = sa;Password = 1qaz7410;";

            #endregion

            #region Clear

            new EFStore<Student>().Truncate();
            new RedisRepository().FlushAll();
            MemoryCache.Default.ToList().ForEach(item => MemoryCache.Default.Remove(item.Key));

            #endregion

            #region SetConfig

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            var storeConfig = new StoreConfig(typeof(Student), caseInfo.Shape,
                JsonConvert.DeserializeObject<List<StoreConfigItem>>(JsonConvert.SerializeObject(caseInfo.ItemGroup)));

            if (action != null)
            {
                action(storeConfig);
            }

            StoreFactory.Default.SetConfig(storeConfig);

            #endregion

            #endregion

            #region InitData

            _StoreCenter = new StoreCenter<Student>();

            for (var i = 0; i < 10; i++)
            {
                var entity = new Student()
                {
                    ID = i + 1,
                    Name = "张三" + i
                };

                _DataGroup.Add(entity);
            }

            _StoreCenter.Add(_DataGroup);

            #endregion

            LogHelper.Enable = true;
        }

        
        #region IDataStore<Student> 

        [Theory]
        [MemberData("TestData")]
        public void GetAll(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            var group = _StoreCenter.GetAll();

            if (caseInfo.Shape == StoreShape.Dic || caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                Assert.Equal(_DataGroup.Count, group.Count());
            }
            else
            {
                Assert.Equal(null, group);
            }

        }

        [Theory]
        [MemberData("TestData")]
        public void Get(string caseName)
        {
            InitCase(caseName);

            var entity = _StoreCenter.Get("1");
            Assert.Equal(_DataGroup.First().Name, entity.Name);

            entity = _StoreCenter.Get("11");
            Assert.Equal(null, entity);
        }

        [Theory]
        [MemberData("TestData")]
        public void Add(string caseName)
        {
            InitCase(caseName);

            Assert.Equal(null,_StoreCenter.Get("11"));

            _StoreCenter.Add(new Student()
            {
                ID=11,
                Name = "刘备"
            });

            Assert.Equal("刘备", _StoreCenter.Get("11").Name);
        }

        [Theory]
        [MemberData("TestData")]
        public void Update(string caseName)
        {
            InitCase(caseName);

            var entity = _StoreCenter.Get("1");
            entity.Name = "刘备";
            _StoreCenter.Update(entity);

            Assert.Equal("刘备", _StoreCenter.Get("1").Name);
        }

        [Theory]
        [MemberData("TestData")]
        public void Delete(string caseName)
        {
            InitCase(caseName);

            Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);

            _StoreCenter.Delete("1");

            Assert.Equal(null, _StoreCenter.Get("1"));
        }

        [Theory]
        [MemberData("TestData")]
        public void Exist(string caseName)
        {
            InitCase(caseName);

            Assert.Equal(true,_StoreCenter.Exist("1"));

            Assert.Equal(false, _StoreCenter.Exist("11"));
        }

        [Theory]
        [MemberData("TestData")]
        public void Count(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.Shape == StoreShape.Dic || caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                Assert.Equal(_DataGroup.Count(), _StoreCenter.Count());
            }
            else
            {
                Assert.Equal(-1, _StoreCenter.Count());
            }
        }

        #endregion

        #region IQueryable

        [Theory]
        [MemberData("TestData")]
        public void QueryGet(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                var group = _StoreCenter.Query("id>=3 and id<=7","id desc");
                Assert.Equal(5, group.Count());
                Assert.Equal(7, group.First().ID);

                LogHelper.WriteLine(group.Count().ToString());
            }
            else
            {
                Assert.Throws<NotSupportedException>(() => _StoreCenter.Query("id>=3 and id<=7"));
            }
    }

        [Theory]
        [MemberData("TestData")]
        public void QueryPageGet(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                var group = _StoreCenter.Query(2,3,"id>=3 and id<=7", "id desc");
                Assert.Equal(2, group.Count());
                Assert.Equal(4, group.First().ID);

                LogHelper.WriteLine(group.Count().ToString());
            }
            else
            {
                Assert.Throws<NotSupportedException>(() => _StoreCenter.Query(2, 3, "id>=3 and id<=7", "id desc"));
            }
        }

        [Theory]
        [MemberData("TestData")]
        public void QueryUpdate(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                _StoreCenter.Update(item => item.ID >= 3 && item.ID <= 7, item => new Student {Name = "李四"});
                var group = _StoreCenter.GetAll().Where(item => item.Name == "李四").ToList();

                Assert.Equal(5, group.Count);
                Assert.Equal(3, group.Min(item => item.ID));
                Assert.Equal(7, group.Max(item => item.ID));

                LogHelper.WriteLine(group.Count().ToString());
            }
            else
            {
                Assert.Throws<NotSupportedException>(
                    () => _StoreCenter.Update(item => item.ID >= 3 && item.ID <= 7, item => new Student {Name = "李四"}));
            }
        }

        [Theory]
        [MemberData("TestData")]
        public void QueryDelete(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                _StoreCenter.Delete(item => item.ID >= 3 && item.ID <= 7);
                var group = _StoreCenter.GetAll().ToList();

                Assert.Equal(_DataGroup.Count-5, group.Count);
                LogHelper.WriteLine(group.Count().ToString());
            }
            else
            {
                Assert.Throws<NotSupportedException>(
                    () => _StoreCenter.Delete(item => item.ID >= 3 && item.ID <= 7));
            }
        }

        [Theory]
        [MemberData("TestData")]
        public void QueryExist(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                var group = _StoreCenter.Exist(item => (item.ID >= 3 && item.ID <= 7) || item.ID == 100);
                group = group.Distinct().OrderBy(item => item);

                Assert.Equal(JsonConvert.SerializeObject(new[] {"3", "4", "5", "6", "7"}),
                    JsonConvert.SerializeObject(group));
                LogHelper.WriteLine(JsonConvert.SerializeObject(group));
            }
            else
            {
                Assert.Throws<NotSupportedException>(
                    () => _StoreCenter.Exist(item => (item.ID >= 3 && item.ID <= 7) || item.ID == 100));
            }
        }

        [Theory]
        [MemberData("TestData")]
        public void QueryCount(string caseName)
        {
            InitCase(caseName);

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                var cnt = _StoreCenter.Count(item => item.ID >= 3 && item.ID <= 7);

                Assert.Equal(5, cnt);
                LogHelper.WriteLine(cnt.ToString());
            }
            else
            {
                Assert.Throws<NotSupportedException>(
                    () => _StoreCenter.Count(item => item.ID >= 3 && item.ID <= 7));
            }
        }

        #endregion

        #region Cache Time

        [Theory]
        [MemberData("TestData")]
        public void TestAbsluteCache(string caseName)
        {
            InitCase(caseName, config => config.Group.ToList().ForEach(sItem => sItem.AbsluteExpires = 1));

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            Thread.Sleep(600);

            Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);

            Thread.Sleep(600);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);
            }
            else
            {
                Assert.Equal(null, _StoreCenter.Get("1"));
            }
        }

        [Theory]
        [MemberData("TestData")]
        public void TestSlideCache(string caseName)
        {
            InitCase(caseName, config => config.Group.ToList().ForEach(sItem => sItem.SlideExpires = 2));

            var caseInfo = GetCaseInfo<CaseInfo>(caseName);

            Thread.Sleep(1300);

            Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);

            Thread.Sleep(1300);

            Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);

            Thread.Sleep(2600);

            if (caseInfo.ItemGroup.Any(item => item.Type == StoreType.DBStore))
            {
                Assert.Equal(_DataGroup.First().Name, _StoreCenter.Get("1").Name);
            }
            else
            {
                Assert.Equal(null, _StoreCenter.Get("1"));
            }
        }

        #endregion

        public class CaseInfo:CaseInfoBase
        {
            public StoreShape Shape { get; set; }
            public List<StoreConfigItem> ItemGroup { get; set; }=new List<StoreConfigItem>();

            public CaseInfo(string caseName, StoreShape shape, List<StoreConfigItem> itemGroup) : base(caseName)
            {
                this.Shape = shape;
                this.ItemGroup = itemGroup;
            }
        }
    }
}

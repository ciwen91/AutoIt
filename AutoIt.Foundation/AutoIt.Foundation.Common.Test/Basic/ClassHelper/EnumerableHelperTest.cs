using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class EnumerableHelperTest:UnitTestBase
    {
        private List<object> _Group=new List<object>()
        {
            new StringBuilder(),
            new SqlConnection()           
        };

        private List<int> _Group2 = new List<int>() {1, 3, 5};

        public EnumerableHelperTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void FirstOrDefault()
        {
            Assert.NotNull(_Group.FirstOrDefault<object, DbConnection>());
            Assert.NotNull(_Group.FirstOrDefault<object, SqlConnection>());
            Assert.Null(_Group.FirstOrDefault<object, FileInfo>());
        }

        [Fact]
        public void FirstOrDefault_NextFunc()
        {
            var exp = new Exception("MsgA", new Exception("MsgB"));

            Assert.NotNull(EnumerableHelper.FirstOrDefault(exp, item => item.InnerException,
                item => item.Message == "MsgB"));
            Assert.NotNull(EnumerableHelper.FirstOrDefault(exp, item => item.InnerException,
                item => item.Message == "MsgA"));
            Assert.Null(EnumerableHelper.FirstOrDefault(exp, item => item.InnerException,
                item => item.Message == "MsgC"));
        }

        [Fact]
        public void Each()
        {
            int a = 0;

            _Group2.Each(item => a += item);

            Assert.Equal(9,a);
        }

        [Fact]
        public void EachWithPre()
        {
            int a = 0;
            int b = 0;

            _Group2.EachWithPre((item, pre) =>
            {
                a += item;
                b += pre;
            });

            Assert.Equal(8,a);
            Assert.Equal(4, b);
        }

        [Fact]
        public void JoinStr()
        {
            Assert.Equal("1,3,5",_Group2.JoinStr(","));
        }

        [Fact]
        public void JoinStr_CastFunc()
        {
            Assert.Equal("1A,3A,5A", _Group2.JoinStr(",", item => item + "A"));
        }

        [Fact]
        public void For()
        {
            Assert.Equal("0,1,2", EnumerableHelper.For(3).JoinStr(","));
        }
    }
}
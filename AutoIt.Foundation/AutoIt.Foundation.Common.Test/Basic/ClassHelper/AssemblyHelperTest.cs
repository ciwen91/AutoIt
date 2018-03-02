using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public  class AssemblyHelperTest:UnitTestBase
    {
        public AssemblyHelperTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void GetAllAssembly()
        {
            Assert.Contains(Assembly.GetExecutingAssembly(), AssemblyHelper.GetAllAssembly());        
        }

        [Fact]
        public void GetAllType()
        {
            Assert.Contains(typeof(AssemblyHelper),AssemblyHelper.GetAllType());
        }

        [Fact]
        public void GetAllRealizeType()
        {
            Assert.Contains(typeof(SqlConnection),typeof(DbConnection).GetAllRealizeType());
        }

        [Fact]
        public void GetAllRealizeInstance()
        {
            Assert.Contains(typeof(SqlConnection),
                AssemblyHelper.GetAllRealizeInstance<DbConnection>().Select(item => item.GetType()));
        }
    }
}

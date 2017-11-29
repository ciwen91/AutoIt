using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Reflection;

namespace AutoIt.Foundation.Store
{
    public class EFConfiguration : DbConfiguration
    {
        public EFConfiguration()
        {
            //无需在配置文件中配置Provider
            SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
        }
    }
}
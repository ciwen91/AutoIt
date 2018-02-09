using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Reflection;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// EF配置(默认配置)
    /// </summary>
    public class EFConfiguration : DbConfiguration
    {
        public EFConfiguration()
        {
            //无需在配置文件中配置Provider
            SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
        }
    }
}
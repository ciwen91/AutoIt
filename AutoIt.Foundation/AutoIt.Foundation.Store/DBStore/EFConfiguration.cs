using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Reflection;

namespace AutoIt.Foundation.StoreCenter.DBStore
{
    public class EFConfiguration : DbConfiguration
    {
        public EFConfiguration()
        {
            SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
        }
    }
}
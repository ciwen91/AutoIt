using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Reflection;

namespace AutoIt.Foundation.Store
{
    public class EFConfiguration : DbConfiguration
    {
        public EFConfiguration()
        {
            SetProviderServices("System.Data.SqlClient", SqlProviderServices.Instance);
        }
    }
}
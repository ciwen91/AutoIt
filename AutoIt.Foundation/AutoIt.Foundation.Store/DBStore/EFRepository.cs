using System.Data.Entity;
using System.Data.Entity.Infrastructure.DependencyResolution;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    public  class EFRepository
    {
        public static DependcyData<string> ConStr=new DependcyData<string>();

        static EFRepository()
        {
            DbConfiguration.SetConfiguration(new EFConfiguration());
        }

        public DbContext NewContext
        {
            get
            {
                var conStr = ConStr.GetData();
                var context= new EFContext(conStr);

                return context;
            }
        }
    }
}
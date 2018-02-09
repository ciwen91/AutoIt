using System.Data.Entity;
using System.Data.Entity.Infrastructure.DependencyResolution;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// EF仓储
    /// </summary>
    public  class EFRepository
    {
        public static DependcyData<string> ConStr=new DependcyData<string>();

        static EFRepository()
        {
            //设置配置
            DbConfiguration.SetConfiguration(new EFConfiguration());
        }

        public DbContext NewContext
        {
            get
            {
                //创建Context
                var conStr = ConStr.GetData();
                var context= new EFContext(conStr);

                //设置输出
                context.Database.Log = LogHelper.WriteLine;//???

                return context;
            }
        }
    }
}
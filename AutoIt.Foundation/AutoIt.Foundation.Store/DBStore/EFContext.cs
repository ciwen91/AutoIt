using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    public class EFContext : DbContext
    {
        public EFContext(string conStr) : base(conStr)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var methodInfo = modelBuilder.GetType().GetMethod("Entity");

            var dbTypeGroup = AssemblyHelper.GetRealizeTypeGroup(typeof(EntityBase));

            foreach (var item in dbTypeGroup)
            {
                var typeMethodInfo = methodInfo.MakeGenericMethod(new Type[] {item});
                typeMethodInfo.Invoke(modelBuilder, null);
            }

            base.OnModelCreating(modelBuilder);

            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
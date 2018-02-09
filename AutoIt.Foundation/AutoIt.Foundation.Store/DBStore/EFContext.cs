using System;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    /// <summary>
    /// EF上下文(实体映射等)
    /// </summary>
    public class EFContext : DbContext
    {
        public EFContext(string conStr) : base(conStr)
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //注册类型到Context
            RegisteAllEntity(modelBuilder);

            base.OnModelCreating(modelBuilder);

            //表名不加后缀
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }

        private void RegisteAllEntity(DbModelBuilder modelBuilder)
        {
            //获取所有实体类(继承自EntityBase)
            var dbTypeGroup = AssemblyHelper.GetAllRealizeType(typeof(EntityBase));

            //获取注册方法
            var methodInfo = modelBuilder.GetType().GetMethod("Entity");

            //注册
            dbTypeGroup.Each(item =>
            {
                var typeMethodInfo = methodInfo.MakeGenericMethod(item);
                typeMethodInfo.Invoke(modelBuilder, null);
            });
        }
    }
}
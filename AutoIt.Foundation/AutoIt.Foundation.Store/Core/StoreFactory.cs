using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoIt.Foundation.StoreCenter.DBStore;
using StoreCenter;

namespace AutoIt.Foundation.StoreCenter.Core
{
   public class StoreFactory
   {
       public IEnumerable<IDataStoreFactory> FactoryGroup = new List<IDataStoreFactory>()
       {
           new RedisCacheFactory(),
           new DBStoreFactory() 
       };

       public object Create2(StoreConfig config)
       {
           var store = typeof(StoreFactory)
               .GetMethod(nameof(Create))
               .MakeGenericMethod(new Type[] {config.DataType})
               .Invoke(this, new object[] {config});

           return store;
       }

       public StoreBase<T> Create<T>(StoreConfig config) where T : EntityBase
       {
           var group = config.Group.Select(item =>
               {
                   var store = Create<T>(item.Type, config.Shape);

                   store.IsLoadAll = config.IsLoadAll;
                   store.AbsluteExpires = item.AbsluteExpires;
                   store.SlideExpires = item.SlideExpires;
                   store.MaxBufferTime = item.MaxBufferTime;
                   store.MaxBufferCount = item.MaxBufferCount;

                   return store;
               })
               .ToList();

           StoreBase<T> preMedia = null;

           foreach (var item in group)
           {
               if (preMedia != null)
               {
                   preMedia.NextMedia = item;
               }
               preMedia = item;
           }

           return group.First();
       }

       private StoreBase<T> Create<T>(StoreType type, StoreShape shape) where T : EntityBase
       {
           var factory = FactoryGroup.First(item => item.StoreType == type);
           var store = factory.Create<T>(shape);

           return store;
       }
   }
}

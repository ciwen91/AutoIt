using System;
using StoreCenter.Core;

namespace StoreCenter.Redis
{
    public class RedisCacheFactory<T> : IDataMediaFactory<T> where T : EntityBase
    {
        public IDataMedia<T> Create(StoreShape shape)
        {
            if (shape == StoreShape.Dic)
            {
                return new RedisCacheForDic<T>();
            }
            else
            {  
                return new RedisCacheForKeyValue<T>();
            }
        }
    }
}
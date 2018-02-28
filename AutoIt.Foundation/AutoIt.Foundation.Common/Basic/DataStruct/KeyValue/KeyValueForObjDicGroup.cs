using System;
using System.Collections.Generic;

namespace AutoIt.Foundation.Common
{
    public class KeyValueForObjDicGroup : KeyValueForDicGroup<Tuple<Type, string>, object>,IKeyObjValue
    {
        public KeyValueForObjDicGroup(IEnumerable<ObjDictionary> group) : base(group)
        {
        }

        public bool Exsite<T>(string name = null)
        {
            var key=new Tuple<Type,string>(typeof(T),name);
            return  base.Exsite(key);
        }

        public T Get<T>(string name = null)
        {
            var key = new Tuple<Type, string>(typeof(T), name);
            return (T)base.Get(key);
        }

        public IKeyObjValue Set<T>(T value, string name = null)
        {
            var key = new Tuple<Type, string>(typeof(T), name);
            base.Set(key, value);
            return this;
        }

        public IKeyObjValue Remove<T>(string name = null)
        {
            var key = new Tuple<Type, string>(typeof(T), name);
            base.Remove(key);
            return this;
        }
    }
}
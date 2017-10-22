using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Infrastructure;
using System.Diagnostics.Eventing.Reader;
using System.Linq;
using Newtonsoft.Json.Linq;
using StoreCenter.Core;

namespace StoreCenter
{
    public class StoreCenter<T>:IDataMedia<T> where T:EntityBase
    {
        protected List<DataMediaInfo<T>> _MediaInfoGroup=new List<DataMediaInfo<T>>();

        #region IDataMedia<T>

        public IEnumerable<T> Get()
        {
            var result = _MediaInfoGroup.DoInChain<DataMediaInfo<T>,IEnumerable<T>>((elm, hasNext, next) =>
            {
                ///ToDO:>0?
                if (elm.IsLoadAll && elm.Media.Count() > 0)
                {
                    return elm.Media.Get();
                }
                else if(hasNext)
                {
                    var data= next();

                    elm.Media.Add(data);

                    return data;
                }
                else
                {
                    return elm.Media.Get();
                }
            });

            return result;
        }

        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            //if load all then load all first
            var result = _MediaInfoGroup.DoInChain<DataMediaInfo<T>, IEnumerable<T>>((elm, hasNext, next) =>
            {
                var media = elm.Media;
                var resultGroup = new List<T>();
                var keys = keyGroup;

                if (elm.IsLoadAll && elm.Media.Count() == 0)
                {
                    if (hasNext)
                    {
                        next();
                    }
                    else
                    {
                        
                    }
                }


                var curGroup = media.Get(keyGroup);
                resultGroup.AddRange(curGroup);

                keyGroup = keyGroup.Except(curGroup.Select(sItem => sItem.Key_));
                if (keyGroup.Any())
                {
                    var nextGroup = next();
                    resultGroup.AddRange(nextGroup);
                    media.Add(nextGroup);
                }

                return resultGroup;
            });

            return result;
        }

        public void Add(IEnumerable<T> @group)
        {
            foreach (var item in _MediaInfoGroup)
            {
                item.Media.Add(group);
            }
        }

        public void Update(IEnumerable<T> @group)
        {
            foreach (var item in _MediaInfoGroup)
            {
                item.Media.Update(group);
            }
        }

        public void Delete(IEnumerable<string> @group)
        {
            foreach (var item in _MediaInfoGroup)
            {
                item.Media.Delete(group);
            }
        }

        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            ///ToDo:Cache Exist?

            var resultKeyGroup=new List<string>();

            foreach (var item in _MediaInfoGroup)
            {
                var media = item.Media;

                if (!keyGroup.Any())
                {
                    break;
                }

                var curKeyGroup= media.Exist(keyGroup);
                resultKeyGroup.AddRange(curKeyGroup);

                keyGroup = keyGroup.Except(curKeyGroup);
            }

            return resultKeyGroup;
        }

        public int Count()
        {
            var result = _MediaInfoGroup.DoInChain<DataMediaInfo<T>, int>((elm, hasNext, next) =>
            {
                BeforeGet(elm, null);

                if (elm.IsLoadAll && elm.Media.Count() > 0)
                {
                    return elm.Media.Count();
                }
                else if (!hasNext)
                {
                    return elm.Media.Count();
                }
                else
                {
                    return next();
                }
            });

            return result;
        }

        #endregion



        #region ExtMethod

        public T Get(string key)
        {
            ///ToDo:集合和单个实体的数据处理能不能统一?
            return Get(new List<string> { key }).FirstOrDefault();
        }
        public void Add(T entity)
        {
            Add(new List<T> { entity });
        }
        public void Update(T entity)
        {
            Update(new List<T> { entity });
        }

        public void Delete(string key)
        {
            Delete(new List<string> { key });
        }

        #endregion


        #region AOP

        public void BeforeGet(DataMediaInfo<T>  mediaInfo,IEnumerable<string> keyGroup)
        {
            mediaInfo.Media.BeforeGet(keyGroup);
        }

        public void BeforeUpdate(IEnumerable<T> group)
        {

        }

        public virtual void BeforeDelete(IEnumerable<string> keyGroup)
        {

        }

        #endregion
    }

    public class DataMediaInfo<T> where T : EntityBase
    {
        public StoreBase<T> Media { get; set; }
        public bool IsLoadAll { get; set; }
    }
}
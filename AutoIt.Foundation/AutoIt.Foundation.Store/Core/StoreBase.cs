using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using TimerTask;

namespace StoreCenter
{
    public abstract class StoreBase<T> : IDataMedia<T> where T : EntityBase
    {
        public string StoreKey
        {
            get { return typeof(T).Name; }
        }
        public StoreShape Shape { get; set; }
        public StoreBase<T> NextMedia { get; set; }

        public bool IsLoadAll { get; set; }
        public bool HasGet { get; set; }     
        public ExpireInfo ExpireInfo { get; set; }
        public StoreBase<T> BufferMedia { get; set; }

        public bool IsToBuffer { get; set; }

        public void Init()
        {
            TimerTaskScheduler.Default.AddTask(new SimpleTimerTaskInfo(() =>
            {
                IsToBuffer = false;

                var group=BufferMedia.Get();
                BufferMedia.Delete(group);

                Add(group);

                IsToBuffer = true;
            }, 30));
        }

        #region  IDataMedia<T>

        public IEnumerable<T> Get()
        {
            BeforeGet(null);

            if (OnlyGetCurMedia)
            {
                return GetInner();
            }
            else
            {
                var next = NextMedia.GetInner();
                Add(next);
                return next;
            }
        }
        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            BeforeGet(keyGroup);

            if (OnlyGetCurMedia)
            {
                return GetInner(keyGroup);
            }
            else
            {
                var cur = GetInner(keyGroup);
                var nextKeyGroup = keyGroup.Except(cur.Select(item => item.Key_));

                if (nextKeyGroup.Any())
                {
                    var next= NextMedia.Get(nextKeyGroup);
                    NextMedia.Add(next);
                    var merge= cur.ToList();
                    merge.AddRange(next);
                    cur = merge;
                }

                return cur;
            }
        }

        public void Add(IEnumerable<T> group)
        {
            if (IsToBuffer)
            {
                if (BufferMedia != null)
                {
                    BufferMedia.Add(group);
                }

                return;
            }

            if (NextMedia != null)
            {
                NextMedia.Add(group);
            }

            BeforeUpdate(group);
            AddInner(group);
        }
        public void Update(IEnumerable<T> group)
        {
            if (NextMedia != null)
            {
                NextMedia.Update(group);
            }

            BeforeUpdate(group);
            UpdateInner(group);
        }
        public void Delete(IEnumerable<string> keyGroup)
        {
            if (NextMedia != null)
            {
                NextMedia.Delete(keyGroup);
            }

            BeforeDelete(keyGroup);
            DeleteInner(keyGroup);
        }

        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            BeforeGet(keyGroup);

            if (OnlyGetCurMedia)
            {
                return ExistInner(keyGroup);
            }
            else
            {
                var cur = ExistInner(keyGroup);
                keyGroup = keyGroup.Except(cur);

                if (keyGroup.Any())
                {
                    var next = NextMedia.Exist(keyGroup);
                    var merge = cur.ToList();
                    merge.AddRange(next);
                    cur = merge;
                }

                return cur;
            }
        }
        public int Count()
        {
            BeforeGet(null);

            if (OnlyGetCurMedia)
            {
                return CountInner();
            }
            else
            {
                return NextMedia.Count();
            }
        }

        #endregion

        #region IDataMedia<T> Realize

        protected abstract IEnumerable<T> GetInner();
        protected abstract IEnumerable<T> GetInner(IEnumerable<string> keyGroup);

        protected abstract void AddInner(IEnumerable<T> group);
        protected abstract void UpdateInner(IEnumerable<T> group);
        protected abstract void DeleteInner(IEnumerable<string> keyGroup);

        protected abstract IEnumerable<string> ExistInner(IEnumerable<string> keyGroup);
        protected abstract int CountInner();

        #endregion

        #region ExtMethod For IDataMedia<T>

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

        public void Delete(IEnumerable<T> group)
        {
            Delete(group.Select(item => item.Key_));
        }

        #endregion

        #region AOP

        public virtual void BeforeGet(IEnumerable<string> keyGroup)
        {
            
        }

        public virtual void BeforeUpdate(IEnumerable<T> group)
        {
            
        }

        public virtual void BeforeDelete(IEnumerable<string> keyGroup)
        {
            
        }
        
        #endregion

        #region Common

        public bool OnlyGetCurMedia
        {
            get { return NextMedia == null || (IsLoadAll && HasGet); }
        }

        public string GetStoreKey(string itemKey)
        {
            return StoreKey + ":" + itemKey;
        }

        public string GetStoreKey(T item)
        {
            return GetStoreKey(item.Key_);
        }

        #endregion
    }
}
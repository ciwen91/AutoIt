using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using TimerTask;

namespace StoreCenter
{
    public abstract class StoreBase<T> : IDataStore<T> where T : EntityBase
    {
        //基本信息
        public string StoreKey
        {
            get { return typeof(T).Name; }
        }

        public StoreShape Shape { get; set; }
        public StoreBase<T> NextMedia { get; set; }

        //加载方式
        private bool _HasGet { get; set; }
        public bool IsLoadAll { get; set; }

        //生命周期
        public int? AbsluteExpires { get; set; }
        public int? SlideExpires { get; set; }

        //缓冲
        private object _BufferLock = new object();
        private bool _IsToBuffer { get; set; }
        private int _BufferCount { get; set; }
        public int? MaxBufferTime { get; set; }
        public int? MaxBufferCount { get; set; }
        public StoreBase<T> BufferMedia { get; set; }

        //数据变化事件(内部原因)
        public Action<IEnumerable<string>> OnChange;

        public void Init()
        {
            if (BufferMedia != null)
            {
                _IsToBuffer = BufferMedia != null;

                TimerTaskScheduler.Default.AddTask(new SimpleTimerTaskInfo(FlushAll, MaxBufferTime??30));
            }


            NextMedia.OnChange += keyGroup =>
            {
                DeleteInner(keyGroup);
                OnChange(keyGroup);
            };
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
                    var merge= cur.ToList();
                    merge.AddRange(next);
                    cur = merge;

                    AddInner(next);
                }

                return cur;
            }
        }

        public void Add(IEnumerable<T> group)
        {
            lock (_BufferLock)
            {
                if (_IsToBuffer)
                {
                        BufferMedia.Add(group);
                        _BufferCount++;

                        if (MaxBufferCount != null&&_BufferCount>=MaxBufferCount)
                        {
                            FlushAll();
                        }

                    return;
                }
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
                ///ToDo:Same Mode With Get
                var cur = ExistInner(keyGroup);
                var nextKeyGroup = keyGroup.Except(cur);

                if (nextKeyGroup.Any())
                {
                    var next = NextMedia.Exist(nextKeyGroup);
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

        public void Delete(T entity)
        {
            Delete(new List<T>() {entity});
        }
        public void Delete(IEnumerable<T> group)
        {
            Delete(group.Select(GetStoreKey));
        }

        #endregion

        #region Others

        public void FlushAll()
        {
            if (BufferMedia != null)
            {
                lock (_BufferLock)
                {
                    try
                    {
                        var group = BufferMedia.Get();

                        _IsToBuffer = false;
                        Add(group);

                        BufferMedia.Delete(group);
                        _BufferCount -= group.Count();
                    }
                    finally
                    {
                        _IsToBuffer = true;
                    }
                }
            }
        }

        #endregion

        #region AOP

        public virtual void BeforeGet(IEnumerable<string> keyGroup)
        {
            _HasGet = true;
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
            get { return NextMedia == null || (IsLoadAll && _HasGet); }
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
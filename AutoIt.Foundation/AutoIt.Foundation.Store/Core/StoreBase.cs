using System;
using System.Collections.Generic;
using System.Linq;
using AutoIt.Foundation.Common;

namespace AutoIt.Foundation.Store
{
    public abstract class StoreBase<T> : IDataStore<T> where T : EntityBase
    {
        //存储信息
        public string StoreKey => typeof(T).Name;

        public StoreBase<T> NextMedia { get; set; }

        //加载模式
        private bool _HasGet { get; set; }
        public bool IsLoadAll { get; set; }

        //生存周期
        public int? AbsluteExpires { get; set; }
        public int? SlideExpires { get; set; }

        //数据缓冲
        private object _BufferLock = new object();
        private bool _IsToBuffer { get; set; }
        private int _BufferCount { get; set; }
        public int MaxBufferTime { get; set; }
        public int? MaxBufferCount { get; set; }
        public StoreBase<T> BufferMedia { get; set; }

        //数据变化事件(内部原因)
        public Action<IEnumerable<string>> OnChange;

        /// <summary>
        /// 初始化
        /// </summary>
        public void Init()
        {
            if (NextMedia != null)
            {
                //处理数据变化
                NextMedia.OnChange += keyGroup =>///???
                {
                    DeleteInner(keyGroup);
                    OnChange(keyGroup);
                };
            }

            InitBuffer();
        }

        #region  IDataMedia<T>

        /// <summary>
        /// 获取数据
        /// </summary>
        public IEnumerable<T> Get(IEnumerable<string> keyGroup)
        {
            //Aop
            BeforeGet(keyGroup);

            //先从当前存储获取数据
            var cur = GetInner(keyGroup);

            if (!OnlyGetCurMedia)
            {
                //再从下级存储获取数据
                var nextKeyGroup = keyGroup.Except(cur.Select(item => item.Key_));

                if (nextKeyGroup.Any())
                {
                    var next = NextMedia.Get(nextKeyGroup);

                    //合并数据
                    var merge = cur.ToList();
                    merge.AddRange(next);
                    cur = merge;

                    //将下级的数据存储起来
                    AddInner(next);
                }
            }

            return cur;
        }
        /// <summary>
        /// 新增数据
        /// </summary>
        public void Add(IEnumerable<T> group)
        {
            //如果Buffer存储不为空,则存到Buffer里
            if (BufferMedia != null)
            {
                lock (_BufferLock)
                {
                    if (_IsToBuffer)
                    {
                        //添加到Buffer
                        BufferMedia.Add(group);
                        _BufferCount += group.Count();

                        //如果超出最大数量,则清空Buffer
                        if (MaxBufferCount != null && _BufferCount >= MaxBufferCount)
                        {
                            FlushBuffer();
                        }

                        return;
                    }
                }
            }

            //先添加下级存储数据
            if (NextMedia != null)
            {
                NextMedia.Add(group);
            }

            //Aop
            BeforeUpdate(group);
            //再添加当前存储数据
            AddInner(group);
        }
        /// <summary>
        /// 更新数据
        /// </summary>
        public void Update(IEnumerable<T> group)
        {
            //先更新下级存储数据
            if (NextMedia != null)
            {
                NextMedia.Update(group);
            }

            //Aop
            BeforeUpdate(group);
            //再更新当前存储数据
            UpdateInner(group);
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        public void Delete(IEnumerable<string> keyGroup)
        {
            //先删除下级存储数据
            if (NextMedia != null)
            {
                NextMedia.Delete(keyGroup);
            }

            //Aop
            BeforeDelete(keyGroup);
            //再删除当前存储数据
            DeleteInner(keyGroup);
        }

        /// <summary>
        /// 获取所有数据
        /// </summary>
        public IEnumerable<T> GetAll()
        {
            //Aop
            BeforeGet(null);

            //从当前存储获取数据
            var group = GetInner();

            return group;  
        }

        /// <summary>
        /// 判断数据是否存在,如果存在则返回Key
        /// </summary>
        public IEnumerable<string> Exist(IEnumerable<string> keyGroup)
        {
            //Aop
            BeforeGet(keyGroup);

            //获取当前存储Key
            var cur = ExistInner(keyGroup);///ToDo:Same Mode With Get

            if (!OnlyGetCurMedia)
            {
                //获取下级存储Key
                var nextKeyGroup = keyGroup.Except(cur);

                if (nextKeyGroup.Any())
                {
                    var next = NextMedia.Exist(nextKeyGroup);

                    //合并数据
                    var merge = cur.ToList();
                    merge.AddRange(next);
                    cur = merge;
                }
            }

            return cur;
        }

        /// <summary>
        /// 获取数据总数
        /// </summary>
        public int Count()
        {
            //Aop
            BeforeGet(null);

            if (OnlyGetCurMedia)
            {
                //获取当前存储数据总数
                var count = CountInner();
                return count;
            }
            else
            {
                //获取下级存储数据总数
                var count = NextMedia.Count();
                return count;
            }
        }

        #endregion

        #region IDataMedia<T> Realize
 
        protected abstract IEnumerable<T> GetInner(IEnumerable<string> keyGroup);
        protected abstract void AddInner(IEnumerable<T> group);
        protected abstract void UpdateInner(IEnumerable<T> group);
        protected abstract void DeleteInner(IEnumerable<string> keyGroup);

        protected abstract IEnumerable<T> GetInner();

        protected abstract IEnumerable<string> ExistInner(IEnumerable<string> keyGroup);
        protected abstract int CountInner();

        #endregion

        #region Buffer

        /// <summary>
        /// 初始化Buffer
        /// </summary>
        private void InitBuffer()
        {
            //定时清空Buffer
            if (BufferMedia != null)
            {
                _IsToBuffer = true;

                TimerTaskScheduler.Default.AddTask(new SimpleTimerTaskInfo(FlushBuffer, MaxBufferTime));
            }      
        }

        /// <summary>
        /// 清空Buffer
        /// </summary>
        private void FlushBuffer()
        {
            lock (_BufferLock)
            {
                try
                {
                    //先从Buffer获取所有数据
                    var group = BufferMedia.GetAll();

                    //将数据写到存储
                    _IsToBuffer = false;
                    Add(group);

                    //从Buffer中删除所有数据
                    BufferMedia.Delete(group.Select(GetStoreKey));
                    _BufferCount -= group.Count();
                }
                finally
                {
                    _IsToBuffer = true;
                }
            }
        }

        #endregion

        #region AOP

        /// <summary>
        /// 获取前执行的操作
        /// </summary>
        public virtual void BeforeGet(IEnumerable<string> keyGroup)
        {
            if (!_HasGet)
            {
                //如果是全部加载,则加载全部数据
                if (IsLoadAll&&NextMedia!=null)
                {
                    var next = NextMedia.GetInner();
                    AddInner(next);
                }

                _HasGet = true;
            }         
        }

        /// <summary>
        /// 更新前执行的操作
        /// </summary>
        public virtual void BeforeUpdate(IEnumerable<T> group)
        {
            
        }

        /// <summary>
        /// 删除前执行的操作
        /// </summary>
        public virtual void BeforeDelete(IEnumerable<string> keyGroup)
        {
            
        }
        
        #endregion

        #region Common

        /// <summary>
        /// 是否只从当前存储获取数据(没有下级存储或已经加载全部数据)
        /// </summary>
        public bool OnlyGetCurMedia => NextMedia == null || (IsLoadAll && _HasGet);///ToDo:Rename

        /// <summary>
        /// 获取项的存储键
        /// </summary>
        public string GetStoreKey(string itemKey)
        {
            return StoreKey + ":" + itemKey;
        }

        /// <summary>
        /// 获取项的存储键
        /// </summary>
        public string GetStoreKey(T item)
        {
            return GetStoreKey(item.Key_);
        }

        #endregion
    }
}
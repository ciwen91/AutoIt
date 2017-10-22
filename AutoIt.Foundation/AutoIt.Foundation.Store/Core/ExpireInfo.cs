using System;

namespace StoreCenter.Core
{
    public class ExpireInfo
    {
        public int? AbsluteExpires;
        public int? SlideExpires;

        public int? Expires => AbsluteExpires >= SlideExpires ? AbsluteExpires : SlideExpires;
    }
}
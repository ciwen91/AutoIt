using System;

namespace StoreCenter
{
    public class ExpireInfo
    {
        public int? AbsluteExpires;
        public int? SlideExpires;

        public int? Expires => AbsluteExpires >= SlideExpires ? AbsluteExpires : SlideExpires;
    }
}
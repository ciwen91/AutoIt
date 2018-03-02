using System;
using System.Reflection;
using AutoIt.Foundation.TestBase;
using Xunit;
using Xunit.Abstractions;

namespace AutoIt.Foundation.Common.Test
{
    public class MemberInfoHelperTest:UnitTestBase
    {
        private TestClass _TestClass = new TestClass() {Field = "A", Prop = "B"};

        private FieldInfo _FiledInfo = typeof(TestClass).GetField(nameof(TestClass.Field));
        private PropertyInfo _PropInfo = typeof(TestClass).GetProperty(nameof(TestClass.Prop));
        private MethodInfo _FunInfo = typeof(TestClass).GetMethod(nameof(TestClass.Func));

        public MemberInfoHelperTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void GetValue()
        {
            Assert.Equal("A",_FiledInfo.GetValue(_TestClass));
            Assert.Equal("B", _PropInfo.GetValue(_TestClass));
            Assert.Throws<NotSupportedException>(() => _FunInfo.GetValue(_TestClass));
        }

        [Fact]
        public void SetValue()
        {
            _FiledInfo.SetValue(_TestClass,"A1");
            _PropInfo.SetValue(_TestClass, "B2");
            Assert.Throws<NotSupportedException>(() => _FunInfo.SetValue(_TestClass, ""));

            Assert.Equal("A1", _FiledInfo.GetValue(_TestClass));
            Assert.Equal("B2", _PropInfo.GetValue(_TestClass));
        }

        public class  TestClass
        {
            public string Field;
            public string Prop { get; set; }

            public int Func()
            {
                return -1;
            }
        }
    }
}
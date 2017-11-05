namespace AutoIt.Foundation.Test
{
    public abstract class Test
    {
        public virtual int Add(int a, int b)
        {
            return a + b;
        }
    }

    public class Test1 : Test
    {
        
    }

    public class Test2 : Test
    {

    }
} 
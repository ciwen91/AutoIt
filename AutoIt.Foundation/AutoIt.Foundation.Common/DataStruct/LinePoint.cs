namespace AutoIt.Foundation.Common
{
    public struct LinePoint
    {
        public int Index { get; set; }
        public int X { get; set; }
        public int Y { get; set; }

        public LinePoint(int index, int x, int y)
        {
            this.Index = index;
            this.X = x;
            this.Y = y;
        }
    }
}
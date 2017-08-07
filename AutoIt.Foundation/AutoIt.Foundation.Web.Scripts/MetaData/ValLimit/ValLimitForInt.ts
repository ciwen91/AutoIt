namespace MetaData {
   export  class ValLimitForInt extends ValLimitBase {
        Min?: number;
        Max?: number;

       constructor(min: number = null, max: number = null, parttern: string = null) {
           super(SimpleType.int,parttern);
           this.Min = min;
           this.Max = max;
       }
   }
}
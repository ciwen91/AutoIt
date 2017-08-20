namespace MetaData {
   export  class ValLimitForInt extends ValLimitBase {
        Min?: number;
        Max?: number;

       constructor(min: number = null, max: number = null, parttern: string = null) {
           super(SimpleType.int,parttern);
           this.Min = min;
           this.Max = max;
        }

       ValidInner(val: string): List<string> {
           var msgGroup = new List<string>();

           if (!/^[1-9]\d*$/.test(val)) {
               msgGroup.Set("��������!");
           } else {
               var valInt = parseInt(val, 10);
               //�Ƿ�������
               var isIn = (!IsEmpty(this.Min) && valInt >= this.Min) || (!IsEmpty(this.Max) && valInt <= this.Max);

               //���ô�����Ϣ
               if (!isIn) {
                   if (!IsEmpty(this.Min) && !IsEmpty(this.Max)) {
                       msgGroup.Set(`ֵ������${this.Min}~${this.Max}����!`);
                   } else if (!IsEmpty(this.Min)) {
                       msgGroup.Set(`����С��${this.Min}!`);
                   } else if (!IsEmpty(this.Max)) {
                       msgGroup.Set(`���ܴ���${this.Max}!`);
                   }
               }
           }

           return msgGroup;
       }
   }
}
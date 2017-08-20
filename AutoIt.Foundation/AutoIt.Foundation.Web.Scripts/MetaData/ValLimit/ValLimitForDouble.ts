///<reference path="ValLimitForInt.ts"/>
namespace MetaData {
    export class ValLimitForDouble extends ValLimitForInt {
        Fraction?: number;

        constructor(min: number=null, max: number=null, fraction: number=null, parttern: string=null) {
            super(min, max, parttern);
            this.Fraction = fraction;
        }

        ValidInner(val: string): List<string> {
            var msgGroup = new List<string>();

            if (!/^[1-9]\d*(\.\d+)?$/.test(val)) {
                msgGroup.Set("��������!");
            } else {
                var valDouble = parseFloat(val);
                //�Ƿ�������
                var isIn = (!IsEmpty(this.Min) && valDouble >= this.Min) || (!IsEmpty(this.Max) && valDouble <= this.Max);

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
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
                msgGroup.Set("不是整数!");
            } else {
                var valDouble = parseFloat(val);
                //是否在区间
                var isIn = (!IsEmpty(this.Min) && valDouble >= this.Min) || (!IsEmpty(this.Max) && valDouble <= this.Max);

                //设置错误信息
                if (!isIn) {
                    if (!IsEmpty(this.Min) && !IsEmpty(this.Max)) {
                        msgGroup.Set(`值必须在${this.Min}~${this.Max}区间!`);
                    } else if (!IsEmpty(this.Min)) {
                        msgGroup.Set(`不能小于${this.Min}!`);
                    } else if (!IsEmpty(this.Max)) {
                        msgGroup.Set(`不能大于${this.Max}!`);
                    }
                }
            }

            return msgGroup;
        }
    }
}
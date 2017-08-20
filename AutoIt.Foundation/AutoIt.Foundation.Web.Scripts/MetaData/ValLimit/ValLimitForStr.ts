namespace MetaData {
    export class ValLimitForStr extends ValLimitBase {
        MinLength?: number;
        MaxLength?: number;

        constructor(minLength: number = null, maxLength: number = null, parttern: string = null) {
            super(SimpleType.string,parttern);
            this.MinLength = minLength;
            this.MaxLength = maxLength;
        }

        ValidInner(val: string): List<string> {
            var msgGroup = new List<string>();

            var length = val.length;
            //是否在区间
            var isIn = (!IsEmpty(this.MinLength) && length >= this.MinLength) || (!IsEmpty(this.MaxLength) && length <= this.MaxLength);

            //设置错误信息
            if (!isIn) {
                if (!IsEmpty(this.MinLength) && !IsEmpty(this.MaxLength)) {
                    msgGroup.Set(`长度必须在${this.MinLength}~${this.MaxLength}区间!`);
                } else if (!IsEmpty(this.MinLength)) {
                    msgGroup.Set(`长度不能小于${this.MinLength}!`);
                } else if (!IsEmpty(this.MaxLength)) {
                    msgGroup.Set(`长度不能大于${this.MaxLength}!`);
                }
            }

            return msgGroup;
        }
    }
}
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
            //�Ƿ�������
            var isIn = (!IsEmpty(this.MinLength) && length >= this.MinLength) || (!IsEmpty(this.MaxLength) && length <= this.MaxLength);

            //���ô�����Ϣ
            if (!isIn) {
                if (!IsEmpty(this.MinLength) && !IsEmpty(this.MaxLength)) {
                    msgGroup.Set(`���ȱ�����${this.MinLength}~${this.MaxLength}����!`);
                } else if (!IsEmpty(this.MinLength)) {
                    msgGroup.Set(`���Ȳ���С��${this.MinLength}!`);
                } else if (!IsEmpty(this.MaxLength)) {
                    msgGroup.Set(`���Ȳ��ܴ���${this.MaxLength}!`);
                }
            }

            return msgGroup;
        }
    }
}
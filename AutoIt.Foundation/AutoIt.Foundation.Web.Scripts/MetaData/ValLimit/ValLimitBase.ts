namespace  MetaData {
    export abstract class ValLimitBase {
        Type:MetaData.SimpleType;
        Required: boolean = false;
        Pattern: string="";

        constructor(type:MetaData.SimpleType,pattern:string=null) {
            this.Pattern = pattern;
        }

        Valid(val:string):List<string> {
            var inValidMsgGroup = new List<string>();

            if (this.Required && IsEmpty(val)) {
                inValidMsgGroup.Set("���ֶ��Ǳ����!");
            }

            if (!IsEmpty(val)) {
                inValidMsgGroup.SetRange(this.ValidInner(val));

                if (!IsEmpty(this.Pattern) && !new RegExp(this.Pattern).test(val)) {
                    inValidMsgGroup.Set("��ʽ����ȷ!");
                }
            }

            return inValidMsgGroup;
        }

        protected ValidInner(val: string): List<string> {
            return new List<string>();
        }
    }
}
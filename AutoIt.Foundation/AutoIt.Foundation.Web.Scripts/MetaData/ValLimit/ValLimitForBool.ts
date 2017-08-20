module MetaData {
    export class ValLimitForBool extends ValLimitBase {
        private _ChioceGroup:List<string>=new List<string>(["true","false","1","0"]);

        constructor() {
            super(SimpleType.bool);
        }

        ValidInner(val: string): List<string> {
            var msgGroup = new List<string>();
            var lowerVal = val.toLowerCase();

            if (!this._ChioceGroup.Contains(lowerVal)) {
                msgGroup.Set("值只能为:" + this._ChioceGroup.ToArray().join() + "!");
            }

            return msgGroup;
        }
    }
}
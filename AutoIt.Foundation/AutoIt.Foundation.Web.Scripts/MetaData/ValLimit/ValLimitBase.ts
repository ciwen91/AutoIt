namespace  MetaData {
    export abstract class ValLimitBase {
        Type:MetaData.SimpleType;
        Required: boolean = false;
        Pattern: string;

        constructor(type:MetaData.SimpleType,pattern:string=null) {
            this.Pattern = pattern;
        }
    }
}
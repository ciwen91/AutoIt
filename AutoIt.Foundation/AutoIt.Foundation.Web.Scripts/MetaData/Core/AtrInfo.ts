namespace MetaData {
    export class AtrInfo {
        Name: string;
        Type: SimpleType=SimpleType.string;
        Required: boolean=false;
        ValLimit: ValLimitBase;

        constructor(name: string,valLimit: ValLimitBase = null) {
            this.Name = name;
            this.ValLimit = valLimit;

            if (valLimit != null) {
                this.Type = valLimit.Type;
                this.Required = valLimit.Required;  
            }
           
        }
    }
}
namespace MetaData {
    export class AtrInfo {
        Name: string;
        Type: SimpleType;
        Required: boolean;
        ValLimit: ValLimitBase;

        constructor(name:string,type:SimpleType,required:boolean=true,valLimit:ValLimitBase=null) {
            this.Name = name;
            this.Type = type;
            this.Required = required;
            this.ValLimit = valLimit;
        }
    }
}
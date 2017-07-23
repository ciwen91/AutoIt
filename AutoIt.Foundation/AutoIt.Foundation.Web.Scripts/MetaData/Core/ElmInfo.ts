namespace MetaData {
    export class ElmInfo {
        Name: string;
        Type: TypeInfo;

        constructor(name:string,type:TypeInfo) {
            this.Name = name;
            this.Type = type;
        }
    }
}
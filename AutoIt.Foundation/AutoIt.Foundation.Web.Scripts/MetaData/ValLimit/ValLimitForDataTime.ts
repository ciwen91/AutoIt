namespace MetaData {
    export class ValLimitForDataTime extends ValLimitBase {
        Type:string;
        Format: string;

        constructor(type:string=null,format:string=null,parttern:string=null) {
            super(parttern);
            this.Type = type;
            this.Format = format;
        }
    }
}
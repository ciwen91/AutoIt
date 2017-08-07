namespace MetaData {
    export class ValLimitForDataTime extends ValLimitBase {
        DateType:string;
        Format: string;

        constructor(dateType:string=null,format:string=null,parttern:string=null) {
            super(SimpleType.datetime,parttern);
            this.DateType = dateType;
            this.Format = format;
        }
    }
}
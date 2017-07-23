namespace  MetaData {
    export abstract class ValLimitBase {
        Pattern: string;

        constructor(pattern:string=null) {
            this.Pattern = pattern;
        }
    }
}
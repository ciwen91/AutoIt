namespace MetaData {
    export class ValLimitForStr extends ValLimitBase {
        MinLength?: number;
        MaxLength?: number;

        constructor(minLength: number = null, maxLength: number = null, parttern: string = null) {
            super(SimpleType.string,parttern);
            this.MinLength = minLength;
            this.MaxLength = maxLength;
        }
    }
}
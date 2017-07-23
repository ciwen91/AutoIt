namespace MetaData {
    class ValLimitForStr extends ValLimitBase {
        MinLength?: number;
        MaxLength?: number;

        constructor(minLength: number = null, maxLength: number = null, parttern: string = null) {
            super(parttern);
            this.MinLength = minLength;
            this.MaxLength = maxLength;
        }
    }
}
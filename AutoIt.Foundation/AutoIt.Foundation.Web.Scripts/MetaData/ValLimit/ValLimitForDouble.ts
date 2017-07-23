///<reference path="ValLimitForInt.ts"/>
namespace MetaData {
    export class ValLimitForDouble extends ValLimitForInt {
        Fraction?: number;

        constructor(min: number=null, max: number=null, fraction: number=null, parttern: string=null) {
            super(min, max, parttern);
            this.Fraction = fraction;
        }
    }
}
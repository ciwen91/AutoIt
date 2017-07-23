function ValLimitAtr(valLimit: MetaData.ValLimitBase) {
    return function (target, propertyKey: string) {
        MetaDataHelper.Set(target, valLimit, propertyKey);
    }
} 
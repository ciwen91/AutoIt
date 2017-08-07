function ValLimitAtr(valLimit: MetaData.ValLimitBase) {
    return function (target, propertyKey: string) {
        MetaDataHelper.SetAtr(target, valLimit, propertyKey);
    }
}
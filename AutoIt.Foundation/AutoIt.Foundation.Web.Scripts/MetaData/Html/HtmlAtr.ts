function HtmlAtr(atrType: MetaData.HtmlAtrType) {
    var htmlAtrInfo = new MetaData.HtmlAtrInfo(atrType);

    return function (target, propertyKey: string) {
        MetaDataHelper.SetAtr(target, htmlAtrInfo, propertyKey);
    }
}
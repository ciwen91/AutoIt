class MetaDataHelper {
    private static _Dic=new Dictionary<any,Lookup<string,any>>();

    static SetAtr(type: any, val: any, memberName: string = null) {
        this._Dic.Get(type, new Lookup<string, any>())
            .Get(memberName, new List<any>())
            .Set(val);
    }

    static GetAtr(type: any, atrType: any, memberName: string=null): any {
        var item = this.GetAllAtr(type, atrType, memberName)
            .ToEnumerble()
            .FirstOrDefault(null);

        return item;
    }

    static GetAllAtr(type: any, atrType: any, memberName: string=null): List<any> {
        var group = this._Dic.Get(type, new Lookup<string, any>())
            .Get(memberName, new List<any>());

        group = group.ToEnumerble()
            .Where(item => IsType(item,atrType))
            .ToList();

        return group;
    }

    static GetAllType(nameSpace:any,baseType:any=null): List<any> {
        var group = new List<any>();

        for (var key in nameSpace) {
            var item = nameSpace[key];
            if (!baseType || IsType(item, baseType)) {
                group.Set(item);
            }
        }

        return group;
    }

    private static _TypeInfoDic=new Dictionary<any,MetaData.TypeInfo>();

    static GetAllTypeInfo(nameSpace: any, baseType: any=null):Dictionary<any,MetaData.TypeInfo> {
        var typeGroup = this.GetAllType(nameSpace, baseType);
        var typeInfoGroup = new Dictionary<any, MetaData.TypeInfo>();

        typeGroup.ToEnumerble()
            .ForEach(item => {
                var info = this.GetTypeInfo(item);
                typeInfoGroup.Set(item,info);
            });

        return typeInfoGroup;
    }

    static GetTypeInfo(type: any):MetaData.TypeInfo {
        if (this._TypeInfoDic.Contains(type)) {
            return this._TypeInfoDic.Get(type);
        }

        //处理父类
        var parentType = getParentType(type);
        var parentInfo = parentType ? this.GetTypeInfo(parentType) : null;

        //处理当前类
        var typeInfo = new MetaData.TypeInfo(type.name,parentInfo);
        this._TypeInfoDic.Set(type, typeInfo);

        return typeInfo;
    }
}
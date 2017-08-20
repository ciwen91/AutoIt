class MetaDataHelper {
    private static _Dic=new Dictionary<any,Lookup<string,any>>();

    /**************特性相关操作**************/

    //附加特性(类型,特性,成员名称)
    static SetAtr(type: any, val: any, memberName: string = null) {
        this._Dic.Get(type, new Lookup<string, any>())
            .Get(memberName, new List<any>())
            .Set(val);
    }

    //获取特性(类型,值,成员名称)
    static GetAtr(type: any, atrType: any, memberName: string=null): any {
        var item = this.GetAllAtr(type, atrType, memberName)
            .ToEnumerble()
            .FirstOrDefault(null);

        return item;
    }

    //获取所有特性(类型,值,成员名称)
    static GetAllAtr(type: any, atrType: any, memberName: string = null): List<any> {
        var group = this._Dic.ToEnumerble()
            .Where(item => IsType(type,item.Item1))
            .SelectMany(item => item.Item2.ToArray())
            .Where(item => item.Item1 == memberName)
            .SelectMany(item => item.Item2.ToArray())
            .Where(item => IsType(atrType,item))
            .ToList();

        return group;
    }

    /**************反射相关操作**************/

    //获取所有类型(命名空间,基类型)
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
    //获取所有属性名称(类型)
    static GetAllPropName(type: any):List<string> {
        var group = this._Dic.ToEnumerble()
            .Where(item => IsType(type,item.Item1))
            .SelectMany(item => item.Item2.ToArray())
            .Select(item => item.Item1)
            .Distinct()
            .ToList();

        return group;
    }


    /**************元数据相关操作**************/

    private static _TypeInfoDic=new Dictionary<any,MetaData.TypeInfo>();

    //获取所有类型元信息(命名空间,基类型)
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

    //获取类型元信息(类型)
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

        //处理

        return typeInfo;
    }

    //获取所有属性元信息(类型)
    static GetAtrInfo(type: any, atrName: string): MetaData.AtrInfo {
        var atr = <MetaData.ValLimitBase>this.GetAtr(type, MetaData.ValLimitBase, atrName);
        var atrInfo: MetaData.AtrInfo = new MetaData.AtrInfo(atrName, atr);

        return atrInfo;
    }
}
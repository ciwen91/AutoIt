class MetaDataHelper {
    private static _Dic=new Dictionary<any,Lookup<string,any>>();

    static Set(type: any, val: any, memberName: string = null) {
        this._Dic.Get(type, new Lookup<string, any>())
            .Get(memberName, new List<any>())
            .Set(val);
    }

    static Get(type: any, atrType: any, memberName: string=null): any {
        var item = this.GetAll(type, atrType, memberName)
            .ToEnumerble()
            .FirstOrDefault(null);

        return item;
    }

    static GetAll(type: any, atrType: any, memberName: string=null): List<any> {
        var group = this._Dic.Get(type, new Lookup<string, any>())
            .Get(memberName, new List<any>());

        group = group.ToEnumerble()
            .Where(item => IsType(item,atrType))
            .ToList();

        return group;
    }
}
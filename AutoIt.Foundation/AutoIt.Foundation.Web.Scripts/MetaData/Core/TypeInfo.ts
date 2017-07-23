namespace MetaData {
    export class TypeInfo {
        Base: TypeInfo;
        Name:string;
        AtrGroup: List<AtrInfo>;
        ElmGroupType: ElmGroupType;
        ElmGroupMode: ElmGroupMode;
        ElmGroup: List<TypeInfo>;

        constructor(name: string, base: TypeInfo=null) {
            this.Name = name;
            this.Base = base;
        }

        GetAttrGroup(): List<AtrInfo> {
            var group = this.Base.GetAttrGroup();
            group.SetRange(this.AtrGroup);

            return group;
        }

        GetElmGroup():List<TypeInfo> {
            var group = this.Base.GetElmGroup();
            group.SetRange(this.ElmGroup);

            return group;
        }
    }
}
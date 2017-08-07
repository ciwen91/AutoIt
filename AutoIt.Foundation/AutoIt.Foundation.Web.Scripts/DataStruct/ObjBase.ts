abstract class ObjBase {
    private _ExtData: Dictionary<any, any> = new Dictionary<any, any>();

    GetExtData(name:any,dft:any):any {
        var val = this._ExtData.Get(name, dft);
        return val;
    }
    SetExtData(key: any, value: any): ObjBase {
        this._ExtData.Set(key, value);
        return this;
    }

    GetMemberValue(memberName: string): any {
        if (typeof this[memberName] == "undefined") {
            return None;
        } else {
            return this[memberName];
        }
    }
    SetMemberValue(memberName: string, value: any): ObjBase {
        this[memberName] = value;
        return this;
    }
}
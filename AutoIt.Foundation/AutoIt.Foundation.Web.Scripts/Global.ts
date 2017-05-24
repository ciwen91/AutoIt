var None = new Object();

function Cast<T>(obj: any) {
    return <T>obj;
}
function CastToAry<T>(t: T | T[]): T[] {
    if (t instanceof Array) {
        return t;
    } else {
        return [<T>t];
    }
}

function GetType(obj: any): any {
    return obj.constructor;
}

function IsEmpty(obj: any): boolean {
    return obj === null || obj === "" || obj === None;
}
function ToValueStr(obj: any, quote: string = '"'): string {
    if (typeof (obj) == "number" || typeof (obj) == "boolean") {
        return obj.toString();
    } else {
        return quote + obj.toString() + quote;
    }
}

function NewGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function NewGuidStr(len: number = 32) {
    return NewGuid().replace(/-/g, '').substr(0, len);
}

function LightClone<T>(t: T): T {
    if (t instanceof Array) {
        return (<any>t).concat();
    } else {
        throw new Error(`未实现${t}的LightClone!`);
    }
}
function DeepClone<T>(t: T): T {
    if (typeof (t) == "object") {
        var F = function () { };
        F.prototype = t.constructor.prototype;

        var obj = new F();
        for (var key in t) {
            obj[key] = DeepClone(t[key]);
        }

        return obj;
    } else {
        return <T>JSON.parse(JSON.stringify(t));
    }
}

function ToDict(obj: Object): Dictionary<string, Object> {
    var dic = new Dictionary<string, Object>();

    $.Enumerable.From(obj).ForEach(item => {
        dic.Set(item.Key, item.Value);
    });

    return dic;
}

//function InitObj<T>(obj: T, initFunc: Action<T>): T {
//    initFunc(obj);
//    return obj;
//}
//function InitControl<T>(obj: T, parent: Control = null, initFunc: Action<T> = null): T {
//    if (initFunc) {
//        initFunc(obj);
//    }

//    if (parent && (<any>parent).ChildGroup) {
//        (<any>parent).ChildGroup.push(obj); 
//    }

//    return obj;
//}
//function StaticInit(obj: any, func: Action<Void>) {
//    if (!StaticInit.prototype.Dic) {
//        StaticInit.prototype.Dic = new Dictionary<any, Void>();
//    }
//    var dic = Cast<Dictionary<any, Void>>(StaticInit.prototype.Dic);

//    var type = obj.GetType;
//    if (!dic.Contains(type)) {
//        func(None);
//    }
//}
//$.fn.ToHtml = function (): string {
//    return $(this)[0].outerHTML;
//}
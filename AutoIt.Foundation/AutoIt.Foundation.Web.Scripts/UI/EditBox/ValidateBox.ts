///<reference path="FormControl.ts"/>
abstract class ValidateBox extends FormControl {
    Required: boolean = false;
    Editable: boolean = true;
    Prompt: string = "";
    ValLimit:MetaData.ValLimitBase=null;
    Formatter: FuncOne<any, any> = null;
    
    OnChange: DelegateTwo<Control, any> = new DelegateTwo<Control, any>();

    Valid() {
        
    }
    IsValid(): boolean {
        return true;
    }
    SetEditable(isEditable:boolean) {
        this.Editable = isEditable;
    }
    GetValue():any {
        return None;
    }
    SetValue(val:any) {
        
    }
}
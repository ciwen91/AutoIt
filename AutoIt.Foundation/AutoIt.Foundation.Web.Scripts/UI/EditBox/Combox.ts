///<reference path="ValidateBox.ts"/>
class Combox extends ValidateBox{
    ValueField: string;
    TextField: string;
    Formatter: FuncOne<any, any>;

    OnSelect: DelegateTwo<Control, any> = new DelegateTwo();

    GetData():List<any> {
        return None;
    }
    SetData(data: List<any>) {
        
    }
}
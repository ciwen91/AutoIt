class SelectBox extends ValidateBox {
    ValueField: string="Value";
    TextField: string="Text";
    Multiple: boolean=false;

    OnSelect: DelegateTwo<Control, any> = new DelegateTwo();

    GetData(): any[] {
        return None;
    }

    SetData(data: any[]) {

    }
}
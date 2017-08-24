///<reference path="ValidateBox.ts"/>
abstract class NoInputValidateBox extends ValidateBox {
    SetEditable(isEditable: boolean) {
        this.Editable = isEditable;
        super.SetEnable(isEditable);
    }
}
class LinkButton extends Control {
    Text: string = "";
    IconCls: string = "";
    IsEnable:boolean=true;

    OnClick: DelegateOne<Control> = new DelegateOne();

    SetEnable(isEnable:boolean) {
        this.IsEnable = isEnable;
    }
}
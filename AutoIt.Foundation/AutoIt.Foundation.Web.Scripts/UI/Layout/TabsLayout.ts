class TabsLayout extends Control {
    OnSelect: DelegateOne<string> = new DelegateOne<string>();

    Add(title: string, content: Control, closable: boolean = false, Icon = "") {
    }
    Close(title: string) {

    }
    Exists(title: string): boolean {
        return false;
    }
    Select(title: string) {

    }
}
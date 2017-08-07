class DockLayout extends Control {
    static Split: AttachProperty<boolean> = new AttachProperty<boolean>();

    Top: Control=null;
    Left: Control = null;
    Center: Control = null;
    Right: Control = null;
    Bottom: Control = null;
}
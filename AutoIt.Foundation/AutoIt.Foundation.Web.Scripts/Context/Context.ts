class  Context {
    static a():number {
        this.a();
        Context.a();
        return 1;
    }
}
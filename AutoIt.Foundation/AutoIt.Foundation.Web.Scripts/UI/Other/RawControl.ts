class RawControl extends Control {
    private _Html: string;

    constructor(html: string, containerTag: string = "span") {
        super();

        if (containerTag) {
            html = `<${containerTag}>${html}</${containerTag}>`;
        }

        this._Html = html;
    }
    
    GetHtmlInner(): string {
        return this._Html;
    }
}
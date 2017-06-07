CodeMirror.defineMode("xml", () => {
    //console.log("token1");
    return {
        token: () => {
            console.log("token");
            return "error";
        }
    };
});

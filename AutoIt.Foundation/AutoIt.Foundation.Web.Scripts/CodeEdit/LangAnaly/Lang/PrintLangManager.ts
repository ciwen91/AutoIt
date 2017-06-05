﻿namespace CodeEdit.LangAnaly.Lang {
   ///<reference path="../LangManagerBase.ts"/>
    export class PrintLangManager extends LangManagerBase{
        PrintToken: boolean;

        constructor(egtStr: string) {
            super(egtStr);
        }

        TokenRead(tokenInfo: Model.TokenInfo) {
            if (this.PrintToken) {
                console.log("%c" + tokenInfo.Value + "," + tokenInfo.Symbol.Name, "color:blue;");
            }
        }

        GramerRead(gramerInfo: Model.GramerInfo) {
            console.log("%c" + ' '.Repeat(gramerInfo.GetLevel() * 3) + gramerInfo.GetLevel() + ":" + gramerInfo.Symbol.Name +
                "," + gramerInfo.Value + "$", "color:green;");
        }

        GramerAccept(gramerInfo: Model.GramerInfo) {
            console.log("%c" + gramerInfo.Symbol.Name + "," + gramerInfo.Value, "color:red;");
        }
    }
}
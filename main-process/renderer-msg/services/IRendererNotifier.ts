import { BrowserWindow } from "electron";

export interface IRendererNotifier
{
    Init (browser: BrowserWindow ): void 
    NotifyRenderer ( type: string ): void 
}
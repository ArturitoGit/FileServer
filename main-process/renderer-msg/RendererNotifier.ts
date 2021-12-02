import { BrowserWindow, MessageChannelMain } from "electron";
import { IRendererNotifier } from "./services/IRendererNotifier";

export class RendererNotifier implements IRendererNotifier
{
    // The port to the renderer
    private port: Electron.MessagePortMain ;

    public Init = (window: BrowserWindow) =>
    {
        // Generate ports
        const { port1, port2 } = new MessageChannelMain()

        // Setup local port
        this.port = port2 ; 
        // this.port.on('message', messageHandler )
        this.port.start()

        // Send port to renderer through preload
        window.webContents.postMessage('main-world-port', null, [port1])
    }

    // Notify
    NotifyRenderer = (type: string): void => this.port.postMessage({type: type}) 

}
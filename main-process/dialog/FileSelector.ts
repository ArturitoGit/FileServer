const { dialog } = require('electron') 
import { IFileSelector } from "./services/IFileSelector";

export class FileSelector implements IFileSelector
{
    async SelectFile(): Promise<{ canceled: boolean; path: string; }> {

        // Open a system dialog to select a file
        var result = await dialog.showOpenDialog({ properties: ['openFile'] }) ;
        
        // If the dialog was canceled
        if (result.canceled || result.filePaths.length <= 0) return {
            canceled: true,
            path: null
        } 

        // Else
        return {
            canceled: false,
            path: result.filePaths[0]
        }
    }
}
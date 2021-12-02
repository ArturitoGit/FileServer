import * as fs from 'fs'
import { dialog } from "electron";
import { IFileSaver } from "./IFileSaver";

export class FileSaver implements IFileSaver
{
    async SaveFile(initial_path: string, default_name: string): Promise<{ canceled: boolean; }> {
        
        // Show dialog to make user select the destination
        var result = await dialog.showSaveDialog({ defaultPath: default_name }) ;

        // If save dialog canceled
        if (result.canceled || result.filePath.length <= 0) return { canceled: true };

        // Move the file from the initial path to the selected path
        fs.rename(initial_path, result.filePath, 
            err => { if (err) console.log('Failed to copy file from tmp to ' + result.filePath) } ) ;

    }
    
}
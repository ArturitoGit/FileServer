import { ipcMain } from "electron";
import { container } from "tsyringe";
import { Download } from "../pipelines/Download";
import { Upload } from "../pipelines/Upload";

// When pipeline request received, call the container handler and 
// ... return the promise of result

ipcMain.handle('upload-request', 
    _ => container.resolve(Upload).Handle())

ipcMain.handle('download-request', 
    _ => container.resolve(Download).Handle())
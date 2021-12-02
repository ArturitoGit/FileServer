import { ipcMain } from "electron";
import { container } from "tsyringe";
import { Download } from "../pipelines/Download";
import { Upload } from "../pipelines/Upload";

ipcMain.handle('download-request', async request => 
{
    // Call the download pipeline
    const handler = container.resolve(Download) ;
    var result = await handler.Handle() ;

    // Return the result
    return result ;
})

ipcMain.handle('upload-request', async request =>
{
    // Call the upload pipeline
    const handler = container.resolve(Upload) ;
    var result = await handler.Handle() ;

    // Return the result
    return result ;
})
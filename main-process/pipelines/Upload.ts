import * as path from 'path'
import { inject, injectable } from 'tsyringe';
import { IFileSelector } from "../dialog/services/IFileSelector";
import { IRendererNotifier } from '../renderer-msg/services/IRendererNotifier';
import { IWebServer } from "../webserver/services/IWebServer";

@injectable()
export class Upload
{
    constructor
    (
        @inject('Webserver')public webServer: IWebServer,
        @inject('FileSelector')public fileSelector: IFileSelector,
        @inject('RendererNotifier')public rendererNotifier: IRendererNotifier
    )
    {}

    public Handle = async (): Promise<UploadResponse> =>
    {
        // Select the file to upload
        var selectFile_result = await this.fileSelector.SelectFile()

        // If invalid selection
        if (selectFile_result.canceled) return {
            canceled: true,
            address: null,
            error: null
        }

        // Else extract the path of the file
        var file_path = selectFile_result.path ;

        // Retrieve the name of the file from the result
        var file_name = path.parse(file_path).base

        // Get the address and set the callback by calling the webserver
        var publishFile_result = await this.webServer.PublishFile(
            file_path,
            file_name, 
            this.onFileUploaded
        )

        // If failure of publish file method
        if (!publishFile_result.success) return {
            canceled: true,
            address: null,
            error: publishFile_result.error
        }

        // Else extract the address from the result
        var address = publishFile_result.address ;

        // Return it
        return {
            canceled: false,
            address: address,
            error: null
        }
    }

    private onFileUploaded = () => 
    {
        // Notify the renderer
        this.rendererNotifier.NotifyRenderer('file-uploaded')
    }
}

export interface UploadResponse
{
    canceled: boolean
    address: string
    error: string
}
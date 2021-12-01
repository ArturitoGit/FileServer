import { FileUploadedEvent } from "../FileUploadedEvent";
import { IEventHandler } from "./IEventHandler";

export class FileUploadedHandler implements IEventHandler<FileUploadedEvent>
{
    Handle(event: FileUploadedEvent): void {
        // TODO
    }
}
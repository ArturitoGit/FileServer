import { globalEvent } from "@billjs/event-emitter";
import { AbstractEvent } from "./AbstractEvent";

export class FileUploadedEvent extends AbstractEvent
{
    static TYPE: string = 'FileUploadedEvent' ;

    constructor ()
    {
        super(FileUploadedEvent.TYPE) ;
    }
}
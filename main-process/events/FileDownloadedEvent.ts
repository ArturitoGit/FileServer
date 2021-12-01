import { globalEvent } from "@billjs/event-emitter"
import { AbstractEvent } from "./AbstractEvent";

export class FileDownloadedEvent extends AbstractEvent 
{

    static TYPE: string = 'FileDownloadedEvent'
    
    constructor (
        public path: string,
        public name: string
    )
    { super(FileDownloadedEvent.TYPE) }
}
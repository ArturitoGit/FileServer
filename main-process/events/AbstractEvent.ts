import { globalEvent } from "@billjs/event-emitter";

export class AbstractEvent
{
    constructor (
        public type: string
    )
    {}

    public Fire = () =>
    {
        globalEvent.fire(this.type, this) ;
    }
}
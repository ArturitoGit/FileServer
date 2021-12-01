import { globalEvent } from "@billjs/event-emitter";
import { AbstractEvent } from "../AbstractEvent";

export interface IEventHandler<T extends AbstractEvent>
{
    Handle( event: T ): void ;
}
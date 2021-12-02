import { inject, injectable } from "tsyringe";
import { IWebServer } from "../webserver/services/IWebServer";

@injectable()
export class Stop
{

    constructor
    (
        @inject('Webserver')public webserver: IWebServer
    )
    {}

    public Handle = async () =>
    {
        // Stop the webserver
        this.webserver.ShutDownServer() ;
    }
}
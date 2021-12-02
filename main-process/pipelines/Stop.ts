import { IWebServer } from "../webserver/services/IWebServer";

export class Stop
{

    constructor
    (
        public webserver: IWebServer
    )
    {}

    public Handle = async () =>
    {
        // Stop the webserver
        this.webserver.ShutDownServer() ;
    }
}
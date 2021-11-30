import 'reflect-metadata' ;
import { container } from "tsyringe";
import { HostResolver } from '../webserver/HostResolver';
import { IHostResolver } from '../webserver/services/IHostResolver';
import { IWebServer } from '../webserver/services/IWebServer';
import { WebServer } from '../webserver/WebServer' ;

// Register the service
container.register<IHostResolver>   ("HostResolver",    { useClass: HostResolver    });
container.register<IWebServer>      ("WebServer",       { useClass: WebServer       });
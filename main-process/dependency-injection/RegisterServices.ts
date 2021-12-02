import { globalEvent } from '@billjs/event-emitter';
import 'reflect-metadata' ;
import { container      } from 'tsyringe' ;
import { FileSelector } from '../dialog/FileSelector';
import { IFileSelector } from '../dialog/services/IFileSelector';
import { AbstractEvent } from '../events/AbstractEvent';
import { IEventHandler } from '../events/handlers/IEventHandler';
import { RootPathProvider } from '../path/RootPathProvider';
import { IRootPathProvider } from '../path/services/IRootPathProvider';
import { HostResolver   } from '../webserver/HostResolver';
import { IHostResolver  } from '../webserver/services/IHostResolver';
import { IWebServer     } from '../webserver/services/IWebServer';
import { WebServer      } from '../webserver/WebServer' ;

// Register the service
container.register<IHostResolver>       ("HostResolver",        { useClass: HostResolver     });
container.register<IWebServer>          ("WebServer",           { useClass: WebServer        });
container.register<IRootPathProvider>   ("RootPathProvider",    { useClass: RootPathProvider });
container.register<IFileSelector>       ("FileSelector",        { useClass: FileSelector     });

globalEvent.on('event', event => {
    
    var type: string = event.type;

    var handler: IEventHandler<AbstractEvent> = container.resolve<IEventHandler<AbstractEvent>>(type) ;
    handler.Handle(event) ;
})
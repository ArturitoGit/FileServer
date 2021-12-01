import 'reflect-metadata' ;
import { container      } from 'tsyringe' ;
import { FileSelector } from '../dialog/FileSelector';
import { IFileSelector } from '../dialog/services/IFileSelector';
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
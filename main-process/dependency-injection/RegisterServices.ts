import 'reflect-metadata' ;
import { container      } from 'tsyringe' ;
import { FileSelector } from '../dialog/FileSelector';
import { IFileSelector } from '../dialog/services/IFileSelector';
import { RootPathProvider } from '../path/RootPathProvider';
import { IRootPathProvider } from '../path/services/IRootPathProvider';
import { RendererNotifier } from '../renderer-msg/RendererNotifier';
import { IRendererNotifier } from '../renderer-msg/services/IRendererNotifier';
import { HostResolver   } from '../webserver/HostResolver';
import { IHostResolver  } from '../webserver/services/IHostResolver';
import { IWebServer     } from '../webserver/services/IWebServer';
import { WebServer      } from '../webserver/WebServer' ;

// Register the service
container.register<IHostResolver>       ("HostResolver",        { useClass: HostResolver     });
container.register<IWebServer>          ("Webserver",           { useClass: WebServer        });
container.register<IRootPathProvider>   ("RootProvider",        { useClass: RootPathProvider });
container.register<IFileSelector>       ("FileSelector",        { useClass: FileSelector     });
container.register<IRendererNotifier>   ("RendererNotifier",    { useClass: RendererNotifier });
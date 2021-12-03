import 'reflect-metadata' ;
import { container, Lifecycle   } from 'tsyringe' ;
import { FileSaver              } from '../dialog/FileSaver';
import { FileSelector           } from '../dialog/FileSelector';
import { IFileSaver             } from '../dialog/services/IFileSaver';
import { IFileSelector          } from '../dialog/services/IFileSelector';
import { RootPathProvider       } from '../path/RootPathProvider';
import { IRootPathProvider      } from '../path/services/IRootPathProvider';
import { RendererNotifier       } from '../renderer-msg/RendererNotifier';
import { IRendererNotifier      } from '../renderer-msg/services/IRendererNotifier';
import { HostResolver           } from '../webserver/HostResolver';
import { IHostResolver          } from '../webserver/services/IHostResolver';
import { IWebServer             } from '../webserver/services/IWebServer';
import { WebServer              } from '../webserver/WebServer' ;

// Register the service
container.register<IHostResolver>       ("HostResolver",        { useClass: HostResolver     });
container.register<IRootPathProvider>   ("RootProvider",        { useClass: RootPathProvider });
container.register<IFileSelector>       ("FileSelector",        { useClass: FileSelector     });
container.register<IFileSaver>          ("FileSaver",           { useClass: FileSaver        });

// Register a singleton : the same webserver is used all along the app life
container.register <IWebServer> ("Webserver", { useClass: WebServer }, { lifecycle: Lifecycle.Singleton });

// Renderer notifier also needs to keep the port as a variable
container.register<IRendererNotifier>   ("RendererNotifier",    { useClass: RendererNotifier }, { lifecycle: Lifecycle.Singleton });

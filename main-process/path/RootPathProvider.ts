import { IRootPathProvider } from "./services/IRootPathProvider";
import * as path from 'path'

export class RootPathProvider implements IRootPathProvider
{
    GetRootPath = (): string => path.join(__dirname, "../../../") ;
}
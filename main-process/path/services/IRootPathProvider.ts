export interface IRootPathProvider
{
    /**
     * Get the absolute path of the project root
     * 
     * returns : the absolute path of the project root
     */
    GetRootPath() : string ;
}
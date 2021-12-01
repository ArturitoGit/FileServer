export interface IFileSelector
{
    /**
     * Select a local file and and return its absolute path
     * 
     * returns : The absolute path of a selected file 
     */
    SelectFile(): Promise<{canceled: boolean, path: string}>
}
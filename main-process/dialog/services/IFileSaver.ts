export interface IFileSaver
{
    SaveFile ( initial_path: string, default_name: string ): Promise<{canceled: boolean}>
}
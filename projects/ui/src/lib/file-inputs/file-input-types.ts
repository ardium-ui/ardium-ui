


export interface FileInputBrowseContext {
    browse: () => void;
}

export interface FileInputFilesContext {
    $implicit: File;
    amount: number;
    files: FileList;
};
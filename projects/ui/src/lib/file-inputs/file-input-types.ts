


export interface FileInputBrowseContext {
    browse: () => void;
}

export interface FileInputFilesContext {
    $implicit: File;
    files: FileList;
};
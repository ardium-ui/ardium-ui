


export interface FileInputBrowseContext {
    browse: () => void;
}

export interface FileInputFileAmountContext {
    amount: number;
}

export interface FileInputFilesContext extends FileInputFileAmountContext {
    $implicit: File[];
    files: File[];
};
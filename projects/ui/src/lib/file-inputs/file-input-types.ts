export interface FileInputBrowseContext {
  browse: () => void;
}

export interface FileInputFileAmountContext extends FileInputBrowseContext {
  amount: number;
}

export interface FileInputFilesContext extends FileInputFileAmountContext {
  $implicit: File[];
  files: File[];
}

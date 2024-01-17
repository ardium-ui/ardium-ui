import { Injectable, Renderer2 } from '@angular/core';
import {
    FileSystemSaveOptions,
    FileSystemMethod,
    FileSystemRequestOptions,
} from './file-system.types';
import { isArray } from 'simple-bool';

const DEFAULT_SAVE_OPTIONS = {
    fileName: 'download',
    method: FileSystemMethod.PreferFileSystem,
};
const DEFAULT_REQUEST_OPTIONS = {
    accept: '*.*',
    method: FileSystemMethod.PreferFileSystem,
    multiple: false,
};

@Injectable({
    providedIn: 'root',
})
export class FileSystemService {
    constructor(private renderer2: Renderer2) {
        try {
            this.isFileSystemAPISupported = 'showSaveFilePicker' in window;
        } catch (err) {}
    }

    readonly isFileSystemAPISupported!: boolean;

    async saveAs(
        data: string | Blob,
        options: FileSystemSaveOptions = DEFAULT_SAVE_OPTIONS
    ) {
        // coerce string to blob if needed
        if (typeof data == 'string') {
            data = new Blob([data], {
                type: 'text/plain',
            });
        }
        // use the File System Access API if supported & preferred
        if (
            this.isFileSystemAPISupported &&
            isNotIFrame() &&
            options.method == FileSystemMethod.PreferFileSystem
        ) {
            // coerce the options.accept into a valid options.types object
            if (options.accept) {
                if (typeof options.accept == 'string') {
                    options.accept = options.accept.split(',');
                }
                if (!options.types) options.types = [];

                const accept = { 'application/octet-stream': options.accept };
                options.types.push({ accept: accept });
            }

            // use the File System Access API
            try {
                const handle = await (window as any).showSaveFilePicker({
                    id: options.directoryId,
                    startIn: options.startDirectory,
                    suggestedName: options.fileName,
                    types: options.types,
                });

                const writable = await handle.createWritable();
                await writable.write(data);
                await writable.close();
                return;
            } catch (err) {
                // fail silently if the user has simply canceled the dialog.
                const error = err as any;
                if (error.name !== 'AbortError') {
                    console.error(error.name, error.message);
                    return;
                }
            }
            return;
        }
        // fallback if the File System Access API is not supported
        // or the user doesn't want to use it
        const blobURL = URL.createObjectURL(data);

        const a = document.createElement('a');
        a.href = blobURL;
        a.download = options.fileName!;
        a.style.display = 'none';
        this.renderer2.appendChild(document.body, a);
        a.click();

        //remove the element from the DOM
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
            this.renderer2.removeChild(document.body, a);
        }, 1000);
    }

    async requestFileUpload(
        options: FileSystemRequestOptions = DEFAULT_REQUEST_OPTIONS
    ): Promise<any> {
        // use the File System Access API if supported & preferred
        if (
            this.isFileSystemAPISupported &&
            isNotIFrame() &&
            options.method == FileSystemMethod.PreferFileSystem
        ) {
            try {
                // coerce the options.accept into a valid options.types object
                if (options.accept) {
                    if (typeof options.accept == 'string') {
                        options.accept = options.accept.split(',');
                    }
                    if (!options.types) options.types = [];

                    const accept = {
                        'application/octet-stream': options.accept,
                    };
                    options.types.push({ accept: accept });
                }

                // open the dialog box
                const handles = await (window as any).showOpenFilePicker({
                    id: options.directoryId,
                    startIn: options.startDirectory,
                    types: options.types,
                    multiple: options.multiple,
                });
                if (!options.multiple) {
                    const file = await handles[0].getFile();
                    file.handle = handles[0];
                    return file;
                }
                return await Promise.all(
                    handles.map(async (handle: any) => {
                        const file = await handle.getFile();
                        file.handle = handle;
                        return file;
                    })
                );
            } catch (err) {
                // fail silently if the user has simply canceled the dialog.
                const error = err as any;
                if (error.name !== 'AbortError') {
                    console.error(error.name, error.message);
                }
                return null;
            }
        }
        // coerce options.accept into a string
        if (isArray(options.accept)) {
            options.accept = options.accept.join(',');
        } else {
            options.accept = options.accept ?? '*';
        }
        // fallback if the File System Access API is not supported
        // or the user doesn't want to use it

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = options.accept;
        input.style.display = 'none';
        this.renderer2.appendChild(document.body, input);
        input.click();

        const filePromise = new Promise((resolve) => {
            input.onchange = () => {
                resolve(
                    input.files && input.files.length > 0 ? input.files : null
                );
                this.renderer2.removeChild(document.body, input);
            };
        });

        return await filePromise;
    }
}

function isNotIFrame() {
    return (() => {
        try {
            return window.self === window.top;
        } catch {
            return false;
        }
    })();
}

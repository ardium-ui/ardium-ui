
import { Directive, TemplateRef } from '@angular/core';

export type FileDropAreaFileContext = {
    $implicit: File;
    files: File[];
};

@Directive({ selector: 'ard-file-drop-area > ng-template[ard-idle-content-tmp]' })
export class ArdiumFileDropAreaIdleContentTemplateDirective {
    constructor(public template: TemplateRef<undefined>) { }
}

@Directive({ selector: 'ard-file-drop-area > ng-template[ard-dragover-content-tmp]' })
export class ArdiumFileDropAreaDragoverContentTemplateDirective {
    constructor(public template: TemplateRef<FileDropAreaFileContext>) { }
}

@Directive({ selector: 'ard-file-drop-area > ng-template[ard-dropped-content-tmp]' })
export class ArdiumFileDropAreaDroppedContentTemplateDirective {
    constructor(public template: TemplateRef<FileDropAreaFileContext>) { }
}
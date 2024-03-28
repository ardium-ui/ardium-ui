import { Directive, TemplateRef } from '@angular/core';
import { FileInputBrowseContext, FileInputFilesContext } from '../file-input-types';

@Directive({
  selector: 'ard-file-drop-area > ng-template[ard-idle-content-tmp]',
})
export class ArdiumFileDropAreaIdleContentTemplateDirective {
  constructor(public template: TemplateRef<FileInputBrowseContext>) {}
}

@Directive({
  selector: 'ard-file-drop-area > ng-template[ard-dragover-content-tmp]',
})
export class ArdiumFileDropAreaDragoverContentTemplateDirective {
  constructor(public template: TemplateRef<FileInputFilesContext>) {}
}

@Directive({
  selector: 'ard-file-drop-area > ng-template[ard-dropped-content-tmp]',
})
export class ArdiumFileDropAreaUploadedContentTemplateDirective {
  constructor(public template: TemplateRef<FileInputFilesContext>) {}
}

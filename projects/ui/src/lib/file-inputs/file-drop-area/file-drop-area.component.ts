import { ChangeDetectionStrategy, Component, ContentChild, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { _FileInputComponentBase } from '../file-input-base';
import { FileInputBrowseContext, FileInputFilesContext } from '../file-input-types';
import { ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaDroppedContentTemplateDirective, ArdiumFileDropAreaIdleContentTemplateDirective } from './file-drop-area.directives';

@Component({
  selector: 'ard-file-drop-area',
  templateUrl: './file-drop-area.component.html',
  styleUrls: ['./file-drop-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumFileDropAreaComponent extends _FileInputComponentBase implements OnInit {
    //! templates
    @ContentChild(ArdiumFileDropAreaIdleContentTemplateDirective, { read: TemplateRef }) idleTemplate: TemplateRef<FileInputBrowseContext> | null = null;
    @ContentChild(ArdiumFileDropAreaDragoverContentTemplateDirective, { read: TemplateRef }) dragoverTemplate: TemplateRef<FileInputFilesContext> | null = null;
    @ContentChild(ArdiumFileDropAreaDroppedContentTemplateDirective, { read: TemplateRef }) droppedTemplate: TemplateRef<FileInputFilesContext> | null = null;

    idleContext(): FileInputBrowseContext {
        return {
            browse: () => { this.openBrowseDialog(); },
        }
    }
    dragoverContext(): FileInputFilesContext {
        const files = this._draggedFiles!;
        return {
            $implicit: files[0],
            files,
        }
    }
    droppedContext(): FileInputFilesContext {
        const files = this.value!;
        return {
            $implicit: files[0],
            files,
        }
    }
}

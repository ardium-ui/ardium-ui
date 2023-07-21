import { ChangeDetectionStrategy, Component, ContentChild, OnInit, TemplateRef, ViewEncapsulation, Input } from '@angular/core';
import { ComponentColor } from '../../types/colors.types';
import { FormElementVariant } from '../../types/theming.types';
import { _FileInputComponentBase } from '../file-input-base';
import { FileInputBrowseContext, FileInputFileAmountContext, FileInputFilesContext } from '../file-input-types';
import { ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaUploadedContentTemplateDirective, ArdiumFileDropAreaIdleContentTemplateDirective } from './file-drop-area.directives';

@Component({
  selector: 'ard-file-drop-area',
  templateUrl: './file-drop-area.component.html',
  styleUrls: ['./file-drop-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumFileDropAreaComponent extends _FileInputComponentBase implements OnInit {

    //! appearance
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;
    @Input() color: ComponentColor = ComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! templates
    @ContentChild(ArdiumFileDropAreaIdleContentTemplateDirective, { read: TemplateRef }) idleTemplate: TemplateRef<FileInputBrowseContext> | null = null;
    @ContentChild(ArdiumFileDropAreaDragoverContentTemplateDirective, { read: TemplateRef }) dragoverTemplate: TemplateRef<FileInputFilesContext> | null = null;
    @ContentChild(ArdiumFileDropAreaUploadedContentTemplateDirective, { read: TemplateRef }) uploadedTemplate: TemplateRef<FileInputFilesContext> | null = null;

    getIdleContext(): FileInputBrowseContext {
        return {
            browse: () => { this.openBrowseDialog(); },
        }
    }
    getDragoverContext(): FileInputFileAmountContext {
        return {
            amount: this._draggedFiles!,
        }
    }
    getUploadedContext(): FileInputFilesContext {
        const files = this.value!;
        return {
            $implicit: files,
            amount: files.length,
            files,
        }
    }
}

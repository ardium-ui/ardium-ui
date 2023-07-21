import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideEventModule, ArdiumFileextPipeModule, ArdiumFilenamePipeModule } from '@ardium-ui/devkit';
import { ArdiumButtonModule } from '../../buttons/button/button.module';
import { ArdiumIconModule } from '../../icon/icon.module';
import { ArdiumFilesizePipeModule } from './../../../../../devkit/src/lib/filesize/filesize.module';
import { ArdiumFileDropAreaComponent } from './file-drop-area.component';
import { ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaIdleContentTemplateDirective, ArdiumFileDropAreaUploadedContentTemplateDirective } from './file-drop-area.directives';



@NgModule({
    declarations: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaUploadedContentTemplateDirective,
    ],
    imports: [
    CommonModule,
        ArdiumButtonModule,
        ArdiumIconModule,
        ArdiumFilesizePipeModule,
        ArdiumFilenamePipeModule,
        ArdiumFileextPipeModule,
        ArdiumClickOutsideEventModule,
    ],
    exports: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaUploadedContentTemplateDirective,
    ]
})
export class ArdiumFileDropAreaModule { }

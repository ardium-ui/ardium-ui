import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFileDropAreaComponent } from './file-drop-area.component';
import { ArdiumFileDropAreaIdleContentTemplateDirective, ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaDroppedContentTemplateDirective } from './file-drop-area.directives';



@NgModule({
    declarations: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaDroppedContentTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaDroppedContentTemplateDirective,
    ]
})
export class ArdiumFileDropAreaModule { }

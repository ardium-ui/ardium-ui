import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFileDropAreaComponent } from './file-drop-area.component';
import { ArdiumFileDropAreaIdleContentTemplateDirective, ArdiumFileDropAreaDragoverContentTemplateDirective, ArdiumFileDropAreaDroppedContentTemplateDirective } from './file-drop-area.directives';
import { ArdiumButtonModule } from '../../buttons/button/button.module';
import { ArdiumIconModule } from '../../icon/icon.module';



@NgModule({
    declarations: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaDroppedContentTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumButtonModule,
        ArdiumIconModule,
    ],
    exports: [
        ArdiumFileDropAreaComponent,
        ArdiumFileDropAreaIdleContentTemplateDirective,
        ArdiumFileDropAreaDragoverContentTemplateDirective,
        ArdiumFileDropAreaDroppedContentTemplateDirective,
    ]
})
export class ArdiumFileDropAreaModule { }

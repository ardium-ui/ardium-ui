import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTableComponent } from './table.component';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumTableCaptionTemplateDirective, ArdiumTableCheckboxTemplateDirective, ArdiumTableHeaderCheckboxTemplateDirective, ArdiumTableTemplateDirective } from './table.directives';



@NgModule({
    declarations: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
        ArdiumTableHeaderCheckboxTemplateDirective,
        ArdiumTableCaptionTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxModule,
    ],
    exports: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
        ArdiumTableHeaderCheckboxTemplateDirective,
        ArdiumTableCaptionTemplateDirective,
    ]
})
export class ArdiumTableModule { }

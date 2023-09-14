import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTableComponent } from './table.component';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumTableCheckboxTemplateDirective, ArdiumTableTemplateDirective } from './table.directives';



@NgModule({
    declarations: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxModule,
    ],
    exports: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
    ]
})
export class ArdiumTableModule { }

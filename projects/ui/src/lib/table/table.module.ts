import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTableComponent } from './table.component';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumTablePaginationModule } from '../table-pagination/table-pagination.module';
import {
    ArdiumTableCaptionTemplateDirective,
    ArdiumTableCheckboxTemplateDirective,
    ArdiumTableHeaderCheckboxTemplateDirective,
    ArdiumTablePaginationTemplateDirective,
    ArdiumTableTemplateDirective,
} from './table.directives';
import { ArdiumIconModule } from '../icon/icon.module';

@NgModule({
    declarations: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
        ArdiumTableHeaderCheckboxTemplateDirective,
        ArdiumTableCaptionTemplateDirective,
        ArdiumTablePaginationTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxModule,
        ArdiumTablePaginationModule,
        ArdiumIconModule,
    ],
    exports: [
        ArdiumTableComponent,
        ArdiumTableTemplateDirective,
        ArdiumTableCheckboxTemplateDirective,
        ArdiumTableHeaderCheckboxTemplateDirective,
        ArdiumTableCaptionTemplateDirective,
        ArdiumTablePaginationTemplateDirective,
    ],
})
export class ArdiumTableModule {}

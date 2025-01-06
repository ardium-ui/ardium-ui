import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumIconModule } from '../icon/icon.module';
import { ArdiumTablePaginationModule } from '../table-pagination/table-pagination.module';
import { ArdiumProgressBarModule } from './../progress-bar/progress-bar.module';
import { ArdiumTableComponent } from './table.component';
import {
  ArdiumTableCaptionTemplateDirective,
  ArdiumTableCheckboxTemplateDirective,
  ArdiumTableHeaderCheckboxTemplateDirective,
  ArdiumTablePaginationTemplateDirective,
  ArdiumTableTemplateDirective,
} from './table.directives';

@NgModule({
  declarations: [
    ArdiumTableComponent,
    ArdiumTableTemplateDirective,
    ArdiumTableCheckboxTemplateDirective,
    ArdiumTableHeaderCheckboxTemplateDirective,
    ArdiumTableCaptionTemplateDirective,
    ArdiumTablePaginationTemplateDirective,
  ],
  imports: [CommonModule, ArdiumCheckboxModule, ArdiumTablePaginationModule, ArdiumIconModule, ArdiumProgressBarModule],
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

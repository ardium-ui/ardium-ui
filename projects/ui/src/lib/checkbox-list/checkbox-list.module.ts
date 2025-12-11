import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { _CheckboxTemplateRepositoryDirective } from '../checkbox/checkbox.internal-directives';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumCheckboxListComponent } from './checkbox-list.component';
import { ArdCheckboxListCheckboxTemplateDirective, ArdCheckboxListLabelTemplateDirective } from './checkbox-list.directives';

@NgModule({
  declarations: [ArdiumCheckboxListComponent, ArdCheckboxListCheckboxTemplateDirective, ArdCheckboxListLabelTemplateDirective],
  imports: [CommonModule, ArdiumCheckboxModule, _CheckboxTemplateRepositoryDirective],
  exports: [ArdiumCheckboxListComponent, ArdCheckboxListCheckboxTemplateDirective, ArdCheckboxListLabelTemplateDirective],
})
export class ArdiumCheckboxListModule {}

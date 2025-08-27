import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { _CheckboxTemplateRepositoryDirective } from '../checkbox/checkbox.internal-directives';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';
import { ArdiumCheckboxListComponent } from './checkbox-list.component';
import { ArdCheckboxListCheckboxTemplateDirective } from './checkbox-list.directives';

@NgModule({
  declarations: [ArdiumCheckboxListComponent, ArdCheckboxListCheckboxTemplateDirective],
  imports: [CommonModule, ArdiumCheckboxModule, _CheckboxTemplateRepositoryDirective],
  exports: [ArdiumCheckboxListComponent, ArdCheckboxListCheckboxTemplateDirective],
})
export class ArdiumCheckboxListModule {}

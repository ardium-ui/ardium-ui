import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCheckboxListModule } from 'projects/ui/src/public-api';
import { CheckboxListPage } from './checkbox-list.page';

@NgModule({
  declarations: [CheckboxListPage],
  imports: [CommonModule, ArdiumCheckboxListModule],
})
export class CheckboxListModule {}

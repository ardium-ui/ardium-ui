import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumCheckboxModule } from 'projects/ui/src/public-api';
import { CheckboxPage } from './checkbox.page';

@NgModule({
  declarations: [CheckboxPage],
  imports: [CommonModule, ArdiumCheckboxModule, FormsModule],
})
export class CheckboxModule {}

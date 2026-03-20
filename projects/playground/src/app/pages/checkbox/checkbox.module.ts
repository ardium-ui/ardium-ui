import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArdiumCheckboxModule } from 'projects/ui/src/public-api';
import { CheckboxPage } from './checkbox.page';

@NgModule({
  declarations: [CheckboxPage],
  imports: [CommonModule, ArdiumCheckboxModule, FormsModule, ReactiveFormsModule],
})
export class CheckboxModule {}

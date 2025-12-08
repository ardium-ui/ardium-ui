import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Field } from '@angular/forms/signals';
import { ArdiumCheckboxListModule } from 'projects/ui/src/public-api';
import { CheckboxListPage } from './checkbox-list.page';

@NgModule({
  declarations: [CheckboxListPage],
  imports: [CommonModule, ArdiumCheckboxListModule, ReactiveFormsModule, Field],
})
export class CheckboxListModule {}

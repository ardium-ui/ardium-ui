import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumDateInputModule } from 'projects/ui/src/public-api';
import { DateInputPage } from './date-input.page';

@NgModule({
  declarations: [DateInputPage],
  imports: [CommonModule, ArdiumDateInputModule, ReactiveFormsModule],
})
export class DateInputModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumDateInputModule } from 'projects/ui/src/public-api';
import { DateInputPage } from './date-input.page';

@NgModule({
  declarations: [DateInputPage],
  imports: [CommonModule, ArdiumDateInputModule],
})
export class DateInputModule {}

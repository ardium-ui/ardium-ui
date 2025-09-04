import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumDateInputModule } from 'projects/ui/src/public-api';
import { DateInputPage } from './date-input.page';

@NgModule({
  declarations: [DateInputPage],
  imports: [ArdiumDateInputModule, ReactiveFormsModule],
})
export class DateInputModule {}

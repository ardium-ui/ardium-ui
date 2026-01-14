import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumDateRangeInputModule } from 'projects/ui/src/lib/inputs/date-input/date-range-input.module';
import { DateRangeInputPage } from './date-range-input.page';

@NgModule({
  declarations: [DateRangeInputPage],
  imports: [ArdiumDateRangeInputModule, ReactiveFormsModule],
})
export class DateRangeInputModule {}

import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumMultipageDateRangeInputModule } from 'projects/ui/src/public-api';
import { MultipageDateRangeInputPage } from './multipage-date-range-input.page';

@NgModule({
  declarations: [MultipageDateRangeInputPage],
  imports: [ArdiumMultipageDateRangeInputModule, ReactiveFormsModule],
})
export class MultipageDateRangeInputModule {}

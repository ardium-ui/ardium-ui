import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumButtonModule } from '../buttons/button';
import { ArdiumIconModule } from '../icon';
import { ArdiumIconButtonModule } from './../buttons/icon-button/icon-button.module';
import { ArdiumCalendarComponent } from './calendar.component';
import { DaysViewComponent } from './views/days-view/days-view.component';
import { MonthsViewComponent } from './views/months-view/months-view.component';
import { YearsViewComponent } from './views/years-view/years-view.component';

@NgModule({
  declarations: [ArdiumCalendarComponent, DaysViewComponent, MonthsViewComponent, YearsViewComponent],
  imports: [CommonModule, DatePipe, UpperCasePipe, ArdiumIconButtonModule, ArdiumIconModule, ArdiumButtonModule],
exports: [ArdiumCalendarComponent],
})
export class ArdiumCalendarModule {}

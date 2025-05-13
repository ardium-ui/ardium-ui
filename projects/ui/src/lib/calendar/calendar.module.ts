import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCalendarComponent } from './calendar.component';
import { DaysViewComponent } from './views/days-view/days-view.component';
import { MonthsViewComponent } from './views/months-view/months-view.component';
import { YearsViewComponent } from './views/years-view/years-view.component';

@NgModule({
  declarations: [ArdiumCalendarComponent],
  imports: [CommonModule, DaysViewComponent, MonthsViewComponent, YearsViewComponent],
  exports: [ArdiumCalendarComponent],
})
export class ArdiumCalendarModule {}

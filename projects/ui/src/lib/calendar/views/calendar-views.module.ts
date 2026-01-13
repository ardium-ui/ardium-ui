import { CommonModule, DatePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumButtonModule } from '../../buttons/button';
import { ArdiumIconButtonModule } from '../../buttons/icon-button';
import { ArdiumIconModule } from '../../icon';
import { DaysViewComponent } from './days-view/days-view.component';
import { MonthsViewComponent } from './months-view/months-view.component';
import { YearsViewComponent } from './years-view/years-view.component';

@NgModule({
  declarations: [DaysViewComponent, MonthsViewComponent, YearsViewComponent],
  imports: [CommonModule, DatePipe, ArdiumIconButtonModule, ArdiumIconModule, ArdiumButtonModule, UpperCasePipe, TitleCasePipe],
  exports: [DaysViewComponent, MonthsViewComponent, YearsViewComponent],
})
export class _CalendarViewsModule {}

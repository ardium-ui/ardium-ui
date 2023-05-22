import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPage } from './calendar.page';
import { ArdiumCalendarModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        CalendarPage
    ],
    imports: [
        CommonModule,
        ArdiumCalendarModule,
    ]
})
export class CalendarModule { }

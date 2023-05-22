import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumCalendarComponent } from './calendar.component';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ArdiumFabModule } from '../buttons/fab/fab.module';
import { ArdiumIconModule } from './../icon/icon.module';


@NgModule({
    declarations: [
        ArdiumCalendarComponent
    ],
    imports: [
    CommonModule,
        ArdiumButtonModule,
        ArdiumFabModule,
        ArdiumIconModule
    ],
    exports: [
        ArdiumCalendarComponent
    ]
})
export class ArdiumCalendarModule { }

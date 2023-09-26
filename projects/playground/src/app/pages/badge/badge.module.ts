import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgePage } from './badge.page';
import { ArdiumBadgeModule, ArdiumButtonModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        BadgePage
    ],
    imports: [
        CommonModule,
        ArdiumBadgeModule,
        ArdiumButtonModule,
    ]
})
export class BadgeModule { }

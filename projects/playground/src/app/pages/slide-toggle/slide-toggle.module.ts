import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideTogglePage } from './slide-toggle.page';
import { ArdiumSlideToggleModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        SlideTogglePage
    ],
    imports: [
        CommonModule,
        ArdiumSlideToggleModule,
    ]
})
export class SlideToggleModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarPage } from './progress-bar.page';
import { ArdiumProgressBarModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        ProgressBarPage
    ],
    imports: [
        CommonModule,
        ArdiumProgressBarModule,
    ]
})
export class ProgressBarModule { }

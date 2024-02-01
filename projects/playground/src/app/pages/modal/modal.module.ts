import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalPage } from './modal.page';
import { ArdiumModalModule, ArdiumSelectModule, ArdiumSlideToggleModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        ModalPage
    ],
    imports: [
        CommonModule,
        ArdiumModalModule,
        ArdiumSelectModule,
        ArdiumSlideToggleModule,
    ]
})
export class ModalModule { }
